from time import sleep
from fake_useragent import UserAgent
print("HELLO WORLD")
agent = UserAgent()
print(agent.chrome)
print("GOODBYE WORLD")
sleep(5)
