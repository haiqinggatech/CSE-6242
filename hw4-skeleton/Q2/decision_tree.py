from util import entropy, information_gain, partition_classes
import numpy as np
import ast

class DecisionTree(object):
    def __init__(self):
        # Initializing the tree as an empty dictionary or list, as preferred
        #self.tree =[] 
        self.tree = {}



    def learn(self, X, y):
        # TODO: Train the decision tree (self.tree) using the the sample X and labels y
        # You will have to make use of the functions in utils.py to train the tree
        
        # One possible way of implementing the tree:
        #    Each node in self.tree could be in the form of a dictionary:
        #       https://docs.python.org/2/library/stdtypes.html#mapping-types-dict
        #    For example, a non-leaf node with two children can have a 'left' key and  a 
        #    'right' key. You can add more keys which might help in classification
        #    (eg. split attribute and split value)
        # starting with the 1st sf

        if len(set(y)) == 1:
            return y[0]

        temp = 0
        split_attribute,split_val = 0,X[0][0]
        x_left, x_right,y_left, y_right = [],[],[],[]
        for i in range(len(X[0])):
            for j in range(len(X)):
                print (X[j][i])
            infoGain = information_gain(y, [partition_classes(X, y, i, X[j][i])[2],partition_classes(X, y, i, X[j][i])[3]])
            if infoGain > temp:
                temp = infoGain
                split_attribute = i
                split_val = X[j][i]
        DecisionTree().learn(x_left, y_left)
        DecisionTree().learn(x_right, y_right)

        
    def classify(self, record):
        # TODO: classify the record using self.tree and return the predicted label
        
        class1 = 0
        class2 = 0
        for row in record:
            if row == 1:
                class2 += 1
            else:
                class1 += 1

        return 1 if class2 > class1 else 0

