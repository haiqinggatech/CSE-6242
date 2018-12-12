hadoop jar ./target/q1-1.0.jar edu.gatech.cse6242.Q1 ./cse6242/test.tsv ./cse6242/testoutput1
hadoop fs -getmerge ./cse6242/testoutput1/ testoutput1.tsv
hadoop fs -rm -r ./cse6242/testoutput1
