

let step = 0.005;
let discretization = [];
for (let i = 0; i < 1+step; i = i+step) {
    discretization.push(i);
}

let arrSum = (arr) => arr.reduce((a, b) => a + b, 0);

function binarySearch(arr, v) {

    if (arr.length == 1) {
        return arr[0];
    } else if (arr.length == 2) {
        if (Math.abs(arr[0] - v) <= Math.abs(arr[1] - v)) {
            return arr[0];
        } else {
            return arr[1];
        }
    }

    var mid = Math.floor(arr.length / 2);
    var best = arr[mid];

    if (best == v) {
        return best
    } else if (best > v) {
        return binarySearch(arr.splice(mid, arr.length+1), v);
    } else {
        return binarySearch(arr.splice(0, mid), v);
    }
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [r, g, b];
}

function binarySearchArr(arr, v_arr) {
    return v_arr.map((v) => binarySearch(arr, v));
}

function getRandomMinMax(min, max) {
    return Math.random() * (max - min) + min;
  }

function normal_dist(mean, variance) {
    return (x) => Math.E ** (-1 * (x - mean) ** 2 / variance);
}

function monochromatic_scheme(num_colors=2, variance=0.02) {
    let initial_hue = Math.random();
    console.log(initial_hue);

    let hue_arr = [initial_hue];

    let combined_dist = (x) => arrSum(hue_arr.map((hue) => normal_dist(hue, variance)(x)));

    return generate_from_dist(combined_dist, num_colors);
}

function complementary_scheme(num_colors=2, variance=0.02) {
    let initial_hue = Math.random();
    let complimentary_hue = (initial_hue + 0.5) % 1

    let hue_arr = [initial_hue, complimentary_hue];

    let combined_dist = (x) => arrSum(hue_arr.map((hue) => normal_dist(hue, variance)(x)));

    return generate_from_dist(combined_dist, num_colors)
}

function triadic_scheme(num_colors=3, variance=0.02) {
    let initial_hue = Math.random();
    let traid_one_hue = (initial_hue + 1/3) % 1;
    let traid_two_hue = (initial_hue - 1/3) % 1;

    let hue_arr = [initial_hue, traid_one_hue, traid_two_hue];

    let combined_dist = (x) => arrSum(hue_arr.map((hue) => normal_dist(hue, variance)(x)));

    return generate_from_dist(combined_dist, num_colors);
}

function generate_from_dist(dist, num_colors) {
    let wrap_indices = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4];
    let unnormalized_p = (x) => arrSum(wrap_indices.map((v) => dist(x + v)));

    let total = arrSum(discretization.map((i) => unnormalized_p(i) * step));

    let p = (x) => unnormalized_p(x) / total;

    let cpd = (x) => arrSum(discretization.map((i) => ((i <= x) ? p(i) * step : 0)));

    let arr = discretization.map((x) => cpd(x));
    
    let random_arr = [];
    for (let i = 0; i < num_colors; i++) {
        random_arr.push(Math.random(0,1));
    }
    
    let hues = binarySearchArr(arr, random_arr);
    console.log(hues);

    let colors = hues.map((hue) => HSVtoRGB(hue, getRandomMinMax(0.15,0.85), getRandomMinMax(0.15,0.85)));

    let final_colors = colors.map((color) => color.map((p) => Math.round(p * 255)));

    return [hues, final_colors];
}