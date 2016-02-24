<h1><?php echo escape ($title); ?></h1>

<?php if ($show_people): ?>
	<ul>
	<?php foreach ($people as $person): ?>
		<li><?php echo escape ($person); ?></li>
	<?php endforeach; ?>
	</ul>
<?php endif; ?>