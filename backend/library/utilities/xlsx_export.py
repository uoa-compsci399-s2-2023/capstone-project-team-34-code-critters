
from openpyxl import Workbook

from flask import current_app, request
from flask_restx import Namespace, Resource, fields

from library.utilities.standardise_images import standardise_image
from library.utilities.inference import get_prediction

################ Blueprint/Namespace Configuration ################
utils_api = Namespace('utilities_api', description='Utilities related operations')
json_parser = utils_api.parser()
json_parser.add_argument('file[]', location='json', type=list, required=True, help='Results JSON')

################ Global Variables ################
img_path = current_app.config['UPLOAD_FOLDER']

################ API Endpoints ################

@utils_api.route('/create_xlsx')
class upload_files_json(Resource):
    
    @utils_api.response(200, 'Success')
    @utils_api.expect(json_parser)
    def post(self):
        if request.is_json:
            json_data = request.get_json()
            wb = Workbook()
            ws = wb.active
            ws.append(["Filename", "Prediction"])
            for file in json_data["file[]"]:
                filename = file["name"]
                pred = file["pred"]
                ws.append([filename, pred])
            wb.save("results.xlsx")
            


    
                    
            return "Success", 200
        else:
            return "Invalid JSON", 405
        
        

