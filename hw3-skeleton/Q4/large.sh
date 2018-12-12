hadoop jar ./target/q4-1.0.jar edu.gatech.cse6242.Q4 ./cse6242/large.tsv ./cse6242/largeoutput1
hadoop fs -getmerge ./cse6242/largeoutput1/ largeoutput1.tsv
hadoop fs -rm -r ./cse6242/largeoutput1
