def selectImageFormat(filename):
    valid_formats = ['png', 'jpg', 'jpeg', 'gif', 'webp']

    for format in valid_formats:
        if filename.lower().endswith(format):
            return f"image/{format}"
    return None

def getPredictions(client, filenames, model=None):
    files = []
    for i, filename in enumerate(filenames):
        fileFormat = selectImageFormat(filename)
        if fileFormat:
            file = open(filename, "rb")
            files.append(("files", (filename, file, fileFormat)))
    if model:
        response = client.post(f"/api/v1/upload_json?model={model}",
                               files=files,
                                )
    else:
        response = client.post("/api/v1/upload_json", files=files)
    # Close all the files
    for file in files:
        file[1][1].close()
    
    return response.json()

def getCSVExport(client, json):
    response = client.post("/api/v1/create_csv", json=json)
    filename = response.headers["Content-Disposition"].split("=")[1]
    return [response.content,filename]

def getXLSXExport(client, json):
    response = client.post("/api/v1/create_xlsx", json=json)
    filename = response.headers["Content-Disposition"].split("=")[1]
    return [response.content,filename]

def getModels(client):
    response = client.get('/api/v1/available_models')
    return response.json()