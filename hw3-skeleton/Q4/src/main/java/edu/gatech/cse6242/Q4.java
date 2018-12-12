package edu.gatech.cse6242;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.IOException;


public class Q4 {

    public static class NodeMapper
        extends Mapper<Object, Text, Text, IntWritable>{

        private IntWritable outDegree = new IntWritable();
	private Text source = new Text();
        private IntWritable inDegree = new IntWritable();        
        private Text target = new Text();

        public void map(Object key, Text value, Context context)
                    throws IOException, InterruptedException {
                source.set(value.toString().split("\\t")[0]);
		target.set(value.toString().split("\\t")[1]);

                outDegree.set(1);
		inDegree.set(-1);

                context.write(source, outDegree);
		context.write(target, inDegree);
      }
    }

    public static class SecondMapper
        extends Mapper<Object, Text, Text, IntWritable>{
        private IntWritable count = new IntWritable(1);
        private Text difference = new Text();

        public void map(Object key, Text value, Context context)
                    throws IOException, InterruptedException {
                difference.set(value.toString().split("\\t")[1]);
                context.write(difference, count);
        }
    }

    public static class NodeReducer
        extends Reducer<Text, IntWritable, Text, IntWritable> {
            
        private IntWritable count = new IntWritable();

        public void reduce(Text key, Iterable<IntWritable> values, Context context)
                    throws IOException, InterruptedException {
            int sum = 0;
            for (IntWritable val : values) {
                    sum +=  val.get();
                }
            count.set(sum);
            context.write(key, count);
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job jobDiff = Job.getInstance(conf, "Q4");

        jobDiff.setJarByClass(Q4.class);
        jobDiff.setMapperClass(NodeMapper.class);
        jobDiff.setCombinerClass(NodeReducer.class);
        jobDiff.setReducerClass(NodeReducer.class);
        jobDiff.setOutputKeyClass(Text.class);
        jobDiff.setOutputValueClass(IntWritable.class);

        FileInputFormat.addInputPath(jobDiff, new Path(args[0]));
        FileOutputFormat.setOutputPath(jobDiff, new Path(args[1]+"temp"));
        jobDiff.waitForCompletion(true);


        Job jobCount = Job.getInstance(conf, "Q4");

        jobCount.setJarByClass(Q4.class);
        jobCount.setMapperClass(SecondMapper.class);
        jobCount.setCombinerClass(NodeReducer.class);
        jobCount.setReducerClass(NodeReducer.class);
        jobCount.setOutputKeyClass(Text.class);
        jobCount.setOutputValueClass(IntWritable.class);

        FileInputFormat.addInputPath(jobCount, new Path(args[1]+"temp"));
        FileOutputFormat.setOutputPath(jobCount, new Path(args[1]));
    	jobCount.waitForCompletion(true);
     

    }
}
