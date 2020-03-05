function create_dimensions(){



}

function create_groups(dimension_list){

	add_group(0, "11★", 25, 60, 58.22222);
	add_group_content(0, 0, "aaa");
	add_group(0, "10★", 64, 70, 24.56700);
	add_group_content(0, 0, "bbbb");
	add_group(0, "9★", 9, 10, 82.23456);
	add_group_content(0, 0, "ccccc");


	$(dimension_content_ids[0]+" .group-list-container .group-div").click(function(e){
		select_group(0, $(dimension_content_ids[0]+" .group-list-container .group-div").index(this));
	});

	select_group(0, 0);
}