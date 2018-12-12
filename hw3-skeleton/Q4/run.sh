hadoop jar ./target/q4-1.0.jar edu.gatech.cse6242.Q4 ./cse6242/test1.tsv ./cse6242/q4output1
hadoop fs -getmerge ./cse6242/q4output1/ q4output1.tsv
hadoop fs -rm -r ./cse6242/q4output1
