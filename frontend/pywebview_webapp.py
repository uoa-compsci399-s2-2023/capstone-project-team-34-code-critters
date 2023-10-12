import webview

application_url = 'https://code-critters-b5d86.web.app/'

if __name__ == '__main__':
    window = webview.create_window('CritterSleuth Web', application_url)
    webview.start(user_agent="client_app")