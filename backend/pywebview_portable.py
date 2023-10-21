# Universal imports
from library import create_app

# GUI imports
import webview
import sys
import threading
import uvicorn

# CLI imports
import argparse
from fastapi.testclient import TestClient
from cmdline.modules import getPredictions, getCSVExport, getXLSXExport, getModels

app = create_app("portable")
backendPort = 6789
def start_server():
    uvicorn.run(app, port=backendPort)

if __name__ == "__main__":
    ## Hide the console window if not spawned from a console
    ## This is required as Windows Terminal does not respect powershell's -WindowStyle Hidden
    ## https://github.com/pyinstaller/pyinstaller/issues/8022
    ## https://github.com/microsoft/terminal/issues/12464

    if sys.platform == 'win32':
        import ctypes
        import ctypes.wintypes
        
        # Get console window
        console_window = ctypes.windll.kernel32.GetConsoleWindow()
        if console_window:
            # Check if console is owned by this process...
            process_id = ctypes.windll.kernel32.GetCurrentProcessId()
            console_process_id = ctypes.wintypes.DWORD()
            ctypes.windll.user32.GetWindowThreadProcessId(console_window, ctypes.byref(console_process_id))
            console_process_id = console_process_id.value
            if process_id == console_process_id:
                # ... and if it is, minimize it
                ctypes.windll.user32.ShowWindow(console_window, 0)
                
    parser = argparse.ArgumentParser(description='Inferencing Application')
    parser.add_argument('-i', '--InputImagePath', metavar='inputimage', type=str, nargs='+', help='the path to the input image file')
    parser.add_argument('-m', '--model', metavar='model', type=str, help='Model used for inference')
    parser.add_argument("-c", '--output_csv', action='store_true', help='Output inference result as csv file')
    parser.add_argument("-x", '--output_xlsx', action='store_true', help='Output inference result as xlsx (Excel) file')
    parser.add_argument('--mute', action='store_true', help='Mutes the results')
    parser.add_argument("--output_file_name", metavar="outputfilename", type=str, help="Output file name")
    parser.add_argument("--output_file_path", metavar="outputfilepath", type=str, help="Output file path")


    group = parser.add_mutually_exclusive_group()
    group.add_argument('-a', '--available_models', action='store_true', help='Lists models available for inference')

    args = parser.parse_args()

    # Check if no arguments were passed
    if not any(vars(args).values()):
        t = threading.Thread(target=start_server)
        t.daemon = True
        t.start()
        
        webview.create_window("CritterSleuth", f"http://localhost:{backendPort}/upload")
        webview.start()
        sys.exit()
    else:
        # Shuts up tensorflow reminding that it wants to be recompiled
        import os
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
        
        client = TestClient(app)

        if args.available_models:
            print(getModels(client))
            sys.exit()
        if args.InputImagePath:    
            if args.model:
                prediction = getPredictions(client, args.InputImagePath, args.model)    
            else:
                prediction = getPredictions(client, args.InputImagePath)
            if not args.mute:
                print(prediction)
            if args.output_csv:
                csvFile,csvFileName = getCSVExport(client, prediction)

                if args.output_file_name:
                    if args.output_file_path:
                        with open(f"{ args.output_file_path}/{ args.output_file_name}.csv", "wb") as f:
                            f.write(csvFile)
                        print(f"Saved Results to {args.output_file_path}/{args.output_file_name}.csv")
                    else:
                        with open(f"{ args.output_file_name}.csv", "wb") as f:
                            f.write(csvFile)
                        print(f"Saved Results to {args.output_file_name}.csv")
                else:
                    csvFileName = csvFileName.strip('"')
                    if args.output_file_path:
                        with open(f"{args.output_file_path}/{csvFileName}", "wb") as f:
                            f.write(csvFile)
                        print(f"Saved Results to {args.output_file_path}/{csvFileName}")
                    else:
                        with open(csvFileName, "wb") as f:
                            f.write(csvFile)
                        print(f"Saved Results to {csvFileName}")
                    
            if args.output_xlsx:
                xlsxFile,xlsxFileName = getXLSXExport(client, prediction)
                if args.output_file_name:
                    if args.output_file_path:
                        with open(f"{ args.output_file_path}/{ args.output_file_name}.xlsx", "wb") as f:
                            f.write(xlsxFile)
                        print(f"Saved Results to {args.output_file_path}/{args.output_file_name}.xlsx")
                    else:
                        with open(f"{ args.output_file_name}.xlsx", "wb") as f:
                            f.write(xlsxFile)
                        print(f"Saved Results to {args.output_file_name}.xlsx")
                else:
                    xlsxFileName = xlsxFileName.strip('"')
                    if args.output_file_path:
                        with open(f"{args.output_file_path}/{xlsxFileName}", "wb") as f:
                            f.write(xlsxFile)
                        print(f"Saved Results to {args.output_file_path}/{xlsxFileName}")
                    else:
                        with open(xlsxFileName, "wb") as f:
                            f.write(xlsxFile)
                        print(f"Saved Results to {xlsxFileName}")