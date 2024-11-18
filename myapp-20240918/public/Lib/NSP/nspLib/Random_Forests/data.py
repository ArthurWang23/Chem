import numpy as np
import matplotlib.pyplot as plt

def make_x_and_y(n):
    x = np.random.randn(n)
    y = np.random.randn(n)
    return x, y

x, y = make_x_and_y(n=1000)
fig, ax = plt.subplots()
ax.scatter(x, y)
fig