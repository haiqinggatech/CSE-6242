hadoop jar ./target/q4-1.0.jar edu.gatech.cse6242.Q4 ./cse6242/small.tsv ./cse6242/smalloutput1
hadoop fs -getmerge ./cse6242/smalloutput1/ smalloutput2.tsv
hadoop fs -rm -r ./cse6242/smalloutput1
