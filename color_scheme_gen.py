import colorsys
import math
import matplotlib.pyplot as plt
import numpy as np
import random as rand

step = 0.005
discretization = np.arange(0, 1+step, step)

def normal_dist(mean, variance):
    return lambda x: math.e ** (-1 * (x - mean) ** 2 / variance)

def monochromatic_scheme(num_colors=2, variance=0.02):
    initial_hue = rand.uniform(0,1)

    combined_dist = lambda x: sum([normal_dist(hue, variance)(x) for hue in [initial_hue]])

    return generate_from_dist(combined_dist, num_colors)

def complementary_scheme(num_colors=2, variance=0.02):
    initial_hue = rand.uniform(0,1)
    complimentary_hue =(initial_hue + 0.5) % 1

    combined_dist = lambda x: sum([normal_dist(hue, variance)(x) for hue in [initial_hue, complimentary_hue]])

    return generate_from_dist(combined_dist, num_colors)

def triadic_scheme(num_colors=3, variance=0.02):
    initial_hue = rand.uniform(0,1)
    traid_one_hue =(initial_hue + 1/3) % 1
    traid_two_hue =(initial_hue - 1/3) % 1

    combined_dist = lambda x: sum([normal_dist(hue, variance)(x) for hue in [initial_hue, traid_one_hue, traid_two_hue]])

    return generate_from_dist(combined_dist, num_colors)

def generate_from_dist(dist, num_colors):
    unnormalized_p = lambda x: sum([dist(x+v) for v in range(-5,5)])

    total = sum([unnormalized_p(i) * step for i in discretization])

    p = lambda x: unnormalized_p(x) / total
    plt.plot(discretization, [p(x) for x in discretization])
    plt.show()

    cpd = lambda x: sum([p(i) * step for i in discretization if i <= x])

    arr = [cpd(x) for x in discretization]
    
    hues = [discretization[v % len(discretization)] for v in np.searchsorted(arr, [rand.uniform(0,1) for _ in range(num_colors)])]

    colors = [list(colorsys.hsv_to_rgb(hue, rand.uniform(0.15,0.85), rand.uniform(0.15,0.85))) for hue in hues]
    for color in colors:
        color.reverse()
    colors = [np.array(color)*255 for color in colors]

    return hues, colors
