import webview

application_path = './build/index.html'

if __name__ == '__main__':
    window = webview.create_window('Insect Identification Web-Application', application_path)
    webview.start()