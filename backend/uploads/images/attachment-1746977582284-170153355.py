import socket

HOST = '127.0.0.1'
PORT = 65432

def interact_with_server():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        
        while True:
            question = s.recv(1024).decode()
            if question.startswith("Game Over"):
                print(question)
                break
            
            print(f"Question: {question}")
            answer = input("Your answer: ")
            s.sendall(answer.encode())
            feedback = s.recv(1024).decode()
            print(feedback)

if __name__ == "__main__":
    interact_with_server()
