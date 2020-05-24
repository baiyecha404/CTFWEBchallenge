from SuperSecureServer import Server

HOST = '0.0.0.0'  # Standard loopback interface address (localhost)
PORT = 8080        # Port to listen on (non-privileged ports are > 1023)
DOC_ROOT = "DocRoot"

if __name__ == "__main__":
    Server(HOST,PORT).listen()
