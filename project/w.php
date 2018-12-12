<?php
$db_username    = "root";
$db_password    = "root";
$db_name        = "movie";
$db_hostname    = "127.0.0.1";
$port = 3306;
$debug  = false;
$movie = mysqli_connect(
   $db_hostname,
   $db_username,
   $db_password,
   $db_name,
   $port) or die( "Unable to connect");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>
<style>
.centerize { 
    text-align: center;
}
 </style>
<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>

<div class="column span-8 append-8 prepend-8 last">
<div style="margin-bottom: 10px; text-align: center; background-color: #FFAAAA;"></div>
<?php    
if(isset($_POST['SubmitButton'])){    
// && !empty($_POST['inputText']
$sql = "SELECT * FROM `movieInfo` WHERE  `movieID` BETWEEN 1 and 300";
$initialResult = mysqli_query($movie,$sql);

$initialArr = mysqli_fetch_assoc($initialResult);

while($initialrow = mysqli_fetch_array($initialResult)  )
{

  $newMovieID = $initialrow['movieID'];


    $sn = 0;
    

    $imdbId1 =  $initialrow['imdbId'];
    $tmdbId1 = $initialrow['tmdbId'];
    $averageRating1 = $initialrow['averageRating'];
    $numVotes1 = $initialrow['numVotes'];
    $titleType1 = $initialrow['titleType'];
    $primaryTitle1 =$initialrow ['primaryTitle'];
    $startYear1 = $initialrow['startYear'];
    $runtimeMinutes1 = $initialrow['runtimeMinutes'];
    $genres1 = $initialrow['genres'];
    $actorName1 =  $initialrow ['actorName'];
    $directorName1 = $initialrow['directorName'];
    $posts[] = array('imdbId'=>$imdbId1,'tmdbId'=>$tmdbId1,'averageRating'=>$averageRating1,'numVotes'=>$numVotes1,'titleType'=>$titleType1,'primaryTitle'=>$primaryTitle1,'startYear'=>$startYear1,'runtimeMinutes'=>$runtimeMinutes1,'genres'=>$genres1,'actorName'=>$actorName1,'directorName'=>$directorName1,'rank'=>$sn,'movieID'=>$newMovieID);
    $res['posts'] = $posts;
    $fp = fopen('/Users/haiqngzhu/Desktop/temp.json','w');
    fwrite($fp,json_encode($res));
    fclose($fp);


// { check if form was submitted
 // $movieName = $_POST['inputText'];



  //   $query ="SELECT  *  FROM `movieInfo` WHERE `primaryTitle`= '$movieName '";

  //   $nameResult = mysqli_query($movie,$query);

  //   $nameArr = mysqli_fetch_assoc($nameResult);

    //  if (mysqli_num_rows($nameResult) > 0 ) {
    // $sn = 0;
    
    // $movieID = $nameArr['movieID'];

    // $imdbId1 =  $nameArr['imdbId'];
    // $tmdbId1 = $nameArr['tmdbId'];
    // $averageRating1 = $nameArr['averageRating'];
    // $numVotes1 = $nameArr['numVotes'];
    // $titleType1 = $nameArr['titleType'];
    // $primaryTitle1 =$nameArr ['primaryTitle'];
    // $startYear1 = $nameArr['startYear'];
    // $runtimeMinutes1 = $nameArr['runtimeMinutes'];
    // $genres1 = $nameArr['genres'];
    // $actorName1 =  $nameArr ['actorName'];
    // $directorName1 = $nameArr['directorName'];
    // $posts[] = array('imdbId'=>$imdbId1,'tmdbId'=>$tmdbId1,'averageRating'=>$averageRating1,'numVotes'=>$numVotes1,'titleType'=>$titleType1,'primaryTitle'=>$primaryTitle1,'startYear'=>$startYear1,'runtimeMinutes'=>$runtimeMinutes1,'genres'=>$genres1,'actorName'=>$actorName1,'directorName'=>$directorName1,'rank'=>$sn,'movieID'=>$movieID);
    // $res['posts'] = $posts;
    // $fp = fopen('/Users/haiqngzhu/Desktop/temp.json','w');
    // fwrite($fp,json_encode($res));
    // fclose($fp);

    //   }
    //   else {
      

  //     }
  // }


  $modelQuery = "SELECT `movieId_b`FROM `model` where `movieId_a`= '$newMovieID' limit 10";
  $modelResult = mysqli_query($movie,$modelQuery );
  $modelArr = mysqli_fetch_assoc($modelResult); 


while($row = mysqli_fetch_array($modelResult)  ){

	$resMovieID = $row['movieId_b'];

//  if ($mysqli->connect_errno) {
//     printf("Connect failed: %s\n", $mysqli->connect_error);
//     exit();
// }


	  $infoQuery ="SELECT * FROM `movieInfo` where `movieID` = '$resMovieID'";

  	$infoResult = mysqli_query($movie,$infoQuery);

    $infoArr= mysqli_fetch_assoc($infoResult);
    
    $num_rows = mysqli_num_rows($infoResult);

    // echo $resMovieID,":";

    if (!($infoResult = mysqli_query($movie,$infoQuery)))
    echo "there are no matching result from query\n";
 //  else{
 //   echo $num_rows," row was returned \n";
 // }

    // echo "   $num_rows Rows\n";

    // echo mysqli_result($infoResult,$infoQuery);



	   // $infoRow = mysqli_fetch_array($infoResult) ;

     // $temp = mysqli_fetch_array($infoResult);
     //  printf ( $temp["primaryTitle"], $temp["averageRating"]);


	     if (mysqli_num_rows($infoResult) > 0 ) {

    $imdbId =  $infoArr['imdbId'];
    $tmdbId = $infoArr['tmdbId'];
    $averageRating = $infoArr['averageRating'];
    $numVotes = $infoArr['numVotes'];
    $titleType = $infoArr['titleType'];
    $primaryTitle =$infoArr ['primaryTitle'];
    $startYear = $infoArr['startYear'];
    $runtimeMinutes = $infoArr['runtimeMinutes'];
    $genres = $infoArr['genres'];
    $actorName =  $infoArr ['actorName'];
    $directorName = $infoArr['directorName'];
    $sn = $sn + 1;
    $ID = $infoArr['movieID'];
 
    $posts[] = array('imdbId'=>$imdbId,'tmdbId'=>$tmdbId,'averageRating'=>$averageRating,'numVotes'=>$numVotes,'titleType'=>$titleType,'primaryTitle'=>$primaryTitle,'startYear'=>$startYear,'runtimeMinutes'=>$runtimeMinutes,'genres'=>$genres,'actorName'=>$actorName,'directorName'=>$directorName,'rank'=>$sn,'movieID'=>$ID);

    $res['posts'] = $posts;
    $fp = fopen('/Users/haiqngzhu/Desktop/temp.json','w');
    fwrite($fp,json_encode($res));
    fclose($fp);
      }
      else{
        echo "error11";
      }  

	  if (!( $infoArr= mysqli_fetch_assoc($infoResult)))
    {
      echo "failed";
    }

   }
}
}
 

 // rename("/Users/haiqngzhu/Desktop/temp.json", "/Users/haiqngzhu/Desktop/$movieName.json");

 ?>

<body>    
<form action="" method="post">
	<div class="centerize">
<label for="first">Movie Name</label>
<div class="centerize">
  <input type="text" name="inputText"/><br><br>
  <div class="centerize">
  <input type="submit" name="SubmitButton"/>
</form>    
</body>


   </div>


