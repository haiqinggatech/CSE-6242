## Data and Visual Analytics - Homework 4
## Georgia Institute of Technology
## Applying ML algorithms to detect seizure

import numpy as np
import pandas as pd
import time

from sklearn.model_selection import cross_val_score, GridSearchCV, cross_validate, train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.svm import SVC
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, normalize

######################################### Reading and Splitting the Data ###############################################
# XXX
# TODO: Read in all the data. Replace the 'xxx' with the path to the data set.
# XXX
data = pd.read_csv('seizure_dataset.csv')

# Separate out the x_data and y_data.
x_data = data.loc[:, data.columns != "y"]
y_data = data.loc[:, "y"]

# The random state to use while splitting the data.
random_state = 100

# XXX
# TODO: Split 70% of the data into training and 30% into test sets. Call them x_train, x_test, y_train and y_test.
# Use the train_test_split method in sklearn with the paramater 'shuffle' set to true and the 'random_state' set to 100.
# XXX
X_train, X_test, y_train, y_test = train_test_split(x_data, y_data, test_size=0.3, random_state=100,shuffle=True)

# ############################################### Linear Regression ###################################################
# XXX
# TODO: Create a LinearRegression classifier and train it.
# XXX

reg = LinearRegression()
reg.fit(X_train, y_train)



# XXX
# TODO: Test its accuracy (on the training set) using the accuracy_score method.
# TODO: Test its accuracy (on the testing set) using the accuracy_score method.
# Note: Use y_predict.round() to get 1 or 0 as the output.
# XXX
regTrain =reg.predict(X_train).round()
regTest = reg.predict(X_test).round()
print("Accuracy for Regression training is ",accuracy_score(y_train, regTrain))
print("Accuracy for Regression testing is ",accuracy_score(y_test, regTest))


# ############################################### Multi Layer Perceptron #################################################
# XXX
# TODO: Create an MLPClassifier and train it.
# XXX

mlp= MLPClassifier()
mlp.fit(X_train,y_train)

# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX
mlpTrain =mlp.predict(X_train)
mlpTest = mlp.predict(X_test)
print("Accuracy for MLP training is ",accuracy_score(y_train, mlpTrain))
print("Accuracy for MLP testing is ",accuracy_score(y_test, mlpTest))




# ############################################### Random Forest Classifier ##############################################
# XXX
# TODO: Create a RandomForestClassifier and train it.
# XXX

RF =RandomForestClassifier()
RF.fit(X_train,y_train)
# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX
RFTrain =RF.predict(X_train).round()
RFTest = RF.predict(X_test).round()
print("Accuracy for RandomForest training is ",accuracy_score(y_train, RFTrain))
print("Accuracy for RandomForest testing is ",accuracy_score(y_test, RFTest))


# XXX
# TODO: Tune the hyper-parameters 'n_estimators' and 'max_depth'.
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX
parameterGrid = {'n_estimators': [10,20,40,80],'max_depth':[5,10,20,40]}
RFResult = GridSearchCV(RF, param_grid=parameterGrid , cv=10)
RFResult.fit(X_train,y_train)

print("The best parameter is ",RFResult.best_params_)
print("The best score is ", RFResult.best_score_)

# ############################################ Support Vector Machine ###################################################
# XXX
# TODO: Pre-process the data to standardize or normalize it, otherwise the grid search will take much longer
# TODO: Create a SVC classifier and train it.
# XXX
dataProcessed=StandardScaler().fit(X_train)
newTrain =dataProcessed.transform(X_train)
newTest = dataProcessed.transform(X_test)
svc=SVC()
svc.fit(newTrain,y_train)
# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX
svcTrain =svc.predict(newTrain)
svcTest = svc.predict(newTest)
print("Accuracy for SVC training is ",accuracy_score(y_train, svcTrain))
print("Accuracy for SVC testing is ",accuracy_score(y_test, svcTest))

# XXX
# TODO: Tune the hyper-parameters 'C' and 'kernel' (use rbf and linear).
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX
parameterGrid = {'kernel':('linear','rbf'),'C':[0.001, 0.1, 10]}
svcResult = GridSearchCV(svc, param_grid=parameterGrid , cv=10)
svcResult.fit(newTrain,y_train)
print("The best parameter is ",svcResult.best_params_)
print("The best score is ", svcResult.best_score_)
print("SVC result: ", svcResult.cv_results_['mean_fit_time'], svcResult.cv_results_['mean_train_score'],svcResult.cv_results_['mean_test_score'])