package edu.gatech.cse6242;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.IOException;
import java.util.StringTokenizer;


public class Q1 {
    public static class TokenizerMapper
    extends Mapper<Object, Text, IntWritable, IntWritable>{
        

        
        public void map(Object key, Text value, Context context
                        ) throws IOException, InterruptedException {
            	String line = value.toString();
                IntWritable source = new IntWritable(Integer.parseInt(line.split("\t")[0]));
                IntWritable weight = new IntWritable(Integer.parseInt(line.split("\t")[2]));
                context.write(source, weight);
       
        }
    }
    
  public static class newReducer
       extends Reducer<IntWritable,IntWritable,IntWritable,IntWritable> {
    private IntWritable result = new IntWritable();

    public void reduce(IntWritable key, Iterable<IntWritable> values,
                       Context context
                       ) throws IOException, InterruptedException {
      int max = 0;
      for (IntWritable val : values) {
        int temp = val.get();
        if(temp > max){
        max = temp;
    }
      }
      result.set(max);
      context.write(key, result);
    }
  }


    
    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "Q1");
        
        /* TODO: Needs to be implemented */
        job.setJarByClass(Q1.class);
        job.setMapperClass(TokenizerMapper.class);
        job.setCombinerClass(newReducer.class);
        job.setReducerClass(newReducer.class);
        job.setOutputKeyClass(IntWritable.class);
        job.setOutputValueClass(IntWritable.class);
        
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}
