
from openpyxl import Workbook
from openpyxl.drawing.image import Image

from flask import current_app, request, send_from_directory, send_file
from flask_restx import Namespace, Resource

from library.utilities.standardise_images import standardise_image
from library.utilities.inference import get_prediction
from PIL import Image as PILimg
from PIL import ImageOps
import os

import hashlib

################ Blueprint/Namespace Configuration ################
utils_api = Namespace('utilities_api', description='Utilities related operations')
json_parser = utils_api.parser()
json_parser.add_argument('results', location='json', type=list, required=True, help='Results JSON')

def resize_img(path):
    img = PILimg.open(path)
    img = ImageOps.fit(img, (100, 100), method=PILimg.Resampling.LANCZOS)
    img.save(path)

################ Global Variables ################
storage_path = current_app.config['STORAGE_FOLDER']
img_path = current_app.config['UPLOAD_FOLDER']

################ API Endpoints ################

@utils_api.route('/create_xlsx')
class upload_files_json(Resource):
    
    @utils_api.response(200, 'Success')
    @utils_api.response(405, 'Invalid File Type')
    @utils_api.expect(json_parser)
    def post(self):
        if request.is_json:
            json_data = request.get_json()
            # File name is based on the hash of the JSON data
            str_data = str(json_data)
            hash_object = hashlib.md5(str_data.encode())
            hash_hex = hash_object.hexdigest()

            # Create the file if it doesn't exist
            if not os.path.isfile(storage_path+hash_hex+".xlsx"):
                wb = Workbook()
                ws = wb.active
                ws.append(["Filename","Image", "Predictions"])
                for result in json_data:
                    filename = result["name"]
                    pred = [item for subpred in result["pred"] for item in subpred]
                    ws.append([filename]+[""]+pred)
                    if os.path.isfile(img_path+filename):
                        resize_img(img_path+filename)

                        img = Image(img_path+filename)
                        ws.add_image(img, "B"+str(ws.max_row))
                        # ws.append([filename]+[""]+pred)
                
                #Auto adjust column width A (FILENAME)
                max_length = 0
                for cell in ws['A']:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = (max_length + 2) * 1.2
                ws.column_dimensions['A'].width = adjusted_width

                # Adjust column width B (IMAGE)
                ws.column_dimensions['B'].width = 14 # Found via trial and error
                for row in ws.iter_rows(min_row=2):
                    ws.row_dimensions[row[0].row].height = 80 # Found via trial and error

                wb.save(storage_path+hash_hex+".xlsx")
            
            path = os.path.join(current_app.static_folder, 'storage/') # Yes I know this is inconsistent, This is the only way i could get this to work
            return send_file(path+hash_hex+".xlsx", as_attachment=True)
            # return send_from_directory(path, hash_hex+".xlsx")
        else:
            return "Invalid JSON", 405
        
        

