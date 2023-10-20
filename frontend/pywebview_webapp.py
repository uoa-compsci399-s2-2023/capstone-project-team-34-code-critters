import webview
import sys
import signal
import ctypes

application_url = 'https://code-critters-b5d86.web.app/'

if __name__ == '__main__':   
    # if sys.platform == 'win32':
    #     import ctypes
    #     import ctypes.wintypes
        
    #     # Get console window
    #     console_window = ctypes.windll.kernel32.GetConsoleWindow()
    #     if console_window:
    #         # Check if console is owned by this process...
    #         process_id = ctypes.windll.kernel32.GetCurrentProcessId()
    #         console_process_id = ctypes.wintypes.DWORD()
    #         ctypes.windll.user32.GetWindowThreadProcessId(console_window, ctypes.byref(console_process_id))
    #         console_process_id = console_process_id.value
    #         if process_id == console_process_id:
    #             # ... and if it is, minimize it
    #             ctypes.windll.user32.ShowWindow(console_window, 2)

    window = webview.create_window('CritterSleuth Web', application_url)
    webview.start(user_agent="client_app")    