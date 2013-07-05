<?php
include dirname(__FILE__).'/tpl.php';
ob_start();?>
<% %for($users as $i=>$usergroup) %>
    <% %for($usergroup as $j=>$user) %>
    <div id='<% $user["id"] %>' class="<% %if (0 == ($j % 2)) %>even<% %else() %>odd<% %endif() %>">
        <a href="/<% $user["name"] %>"><% $user["name"] %><% $user["text"] %> <% %n($i) + %n($j) %></a>: <strong><% $user["text"] %></strong>
    </div>
    <% %elsefor() %>
    <div class="none">No Users</div>
    <% %endfor() %>
<% %endfor() %>
<?php
$tpl=ob_get_clean();
$data=array(
    'users'=>array(
        array( 
            array('name'=>'u1', 'text'=>'text1', 'id'=>'id1'),
            array('name'=>'u2', 'text'=>'text2', 'id'=>'id2'),
            array('name'=>'u3', 'text'=>'text3', 'id'=>'id3'),
        ),
        array( 
            array('name'=>'u4', 'text'=>'text4', 'id'=>'id4'),
            array('name'=>'u5', 'text'=>'text5', 'id'=>'id5'),
            array('name'=>'u6', 'text'=>'text6', 'id'=>'id6'),
        ),
        array( 
            array('name'=>'u7', 'text'=>'text7', 'id'=>'id7'),
            array('name'=>'u8', 'text'=>'text8', 'id'=>'id8'),
            array('name'=>'u9', 'text'=>'text9', 'id'=>'id9'),
        ),
    )
);
?>
<!DOCTYPE html>
<html>

    <!-- PROOf Of CONCEPT
    /*
    *  Simple light-weight javascript templating engine (part of php templating engine)
    *  @author: Nikos M.  http://nikos-web-development.netai.net/
    *
    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
    *  http://ejohn.org/blog/javascript-micro-templating/
    *
    */
    -->
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <script src="tpl.js"></script>

        <script type="text/html" id="demo_tmpl">
        <?php echo $tpl; ?>
        </script>
    </head>

    <body>
        
        PHP:
        <div id="results_php">
            <?php 
                Tpl::load("demo_tmpl", $tpl);
                echo Tpl::tmpl("demo_tmpl", $data); 
                //Tpl::test($tpl);
            ?>
        </div>
        
        <hr />
        
        JS:
        <div id="results_js">
        </div>
        <pre id="pre"></pre>
        <script>
            Tpl.load("demo_tmpl", document.getElementById("demo_tmpl").innerHTML);
            var results = document.getElementById("results_js");
            results.innerHTML = Tpl.tmpl("demo_tmpl", <?php echo json_encode($data); ?>);
        </script>
    
    </body>

</html>