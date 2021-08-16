import random  
import string  
def Upper_Lower_string(length): # define the function and pass the length as argument  
    # Print the string in Lowercase  
    result = ''.join((random.choice(string.ascii_letters) for x in range(length))) # run loop until the define length  
    return result  
