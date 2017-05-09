// This json represents the tree
var treeData = {
	name: 2,
	children: [
		{
			name: 1,
			direction: 'left',
			children: [
				{
					name: 1.5,
					direction: 'right',
					children: [{
							name: 2.25,
							direction: 'left'
						},
						{
							name: 2.75,
							direction: 'right'
						}
					]
				}
			]
		},
		{
			name: 3,
			direction: 'right',
			children: [
				{
					name: 2.5,
					direction: 'left',
					children: [{
							name: 2.25,
							direction: 'left'
						},
						{
							name: 2.75,
							direction: 'right'
						}
					]
				},
				{
					name: 4,
					direction: 'right',
					children: [{
							name: 2.25,
							direction: 'left'
						},
						{
							name: 2.75,
							direction: 'right'
						}
					]
				}
			]
		}
	]
};

drawTree();
treeData.children[0].children.shift();
drawTree();

// Draws the tree in treeData
function drawTree() {
	// Clear the canvas
	d3.select("svg").remove();

	// set the dimensions and margins of the diagram
	var margin = {
			top: 40,
			right: 90,
			bottom: 50,
			left: 90
		},
		width = 900 - margin.left - margin.right,
		height = 900 - margin.top - margin.bottom;

	// declares a tree layout and assigns the size
	var treemap = d3.tree()
		.size([width, height]);

	//  assigns the data to a hierarchy using parent-child relationships
	var nodes = d3.hierarchy(treeData);

	// maps the node data to the tree layout
	nodes = treemap(nodes);

	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom),
		g = svg.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	// adds the links between the nodes
	var link = g.selectAll(".link")
		.data(nodes.descendants().slice(1))
		.enter().append("path")
		.attr("class", "link")
		.attr("d", function(d) {
			// If its child is the only one
			// move it to the right or to the left
			// (the D3.js tree's default will put the nodes
			// exactly below its parent)
			if (d.children && d.children.length == 1) {
				if (d.children[0].data.direction == "right")
					moveNode(d.children[0], Math.abs(d.parent.x - d.x) / 2);
				else
					moveNode(d.children[0], -Math.abs(d.parent.x - d.x) / 2);
			}

			return "M" + d.x + "," + d.y +
				"C" + d.x + "," + (d.y + d.parent.y) / 2 +
				" " + d.parent.x + "," + (d.y + d.parent.y) / 2 +
				" " + d.parent.x + "," + d.parent.y;
		});

	// Moves a subtree on the X-axis by some distance
	function moveNode(node, distance) {
		node.x += distance;
		if (node.children)
			for (var i = 0; i < node.children.length; i++)
				moveNode(node.children[i], distance);
	}

	// adds each node as a group
	var node = g.selectAll(".node")
		.data(nodes.descendants())
		.enter().append("g")
		.attr("class", function(d) {
			return "node" +
				(d.children ? " node--internal" : " node--leaf");
		})
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});

	// adds the circle to the node
	node.append("circle")
		.attr("r", 20);

	// adds the text to the node
	node.append("text")
		.attr("dy", ".35em")
		.attr("y", function(d) {
			return 0;
		})
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.name;
		});
}
