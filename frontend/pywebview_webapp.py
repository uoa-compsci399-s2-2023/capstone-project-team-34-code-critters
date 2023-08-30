import webview

application_path = './build/index.html'

if __name__ == '__main__':
    window = webview.create_window('CritterSleuth Web', application_path)
    webview.start()