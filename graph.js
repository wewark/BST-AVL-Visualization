var textBox = document.getElementById('value');
var msg = document.getElementById('msg');

function InsertNode() {
	var val = Number(textBox.value || getRandomInt(0, 1000));
	bst.InsertVal(val);
	textBox.value = '';
	drawTree();
}

function DeleteNode() {
	if (textBox.value != '') {
		var val = Number(textBox.value);
		bst.DeleteVal(val);
		textBox.value = '';
		drawTree();
	}
}

function SearchNode() {
	if (textBox.value != '') {
		var val = Number(textBox.value);
		var node = bst.Search(val);
		if (node == -1)
			msg.innerHTML = 'not found';
		else
			msg.innerHTML = 'found';
	}
}

// traversal is a function
function Print(traversal) {
	var numbers = traversal.call(bst);
	msg.innerHTML = numbers.join(', ');
}

function handleKeyPress(e) {
	var key = e.keyCode || e.which;
	msg.innerHTML = '';
	if (key == 13)
		InsertNode();
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Draws the tree in treeData
function drawTree() {

	// Clear the canvas
	d3.select("svg").remove();

	// This json represents the tree
	var treeData;
	// If the tree is not empty
	if (bst.root)
		treeData = bst.root.json;
	else
		return;

	// set the dimensions and margins of the diagram
	var margin = {
			top: 40,
			right: 90,
			bottom: 50,
			left: 90
		},
		width = window.innerWidth - 10 - margin.left - margin.right,
		height = window.innerHeight - 45 - margin.top - margin.bottom;

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
			if (d.parent && d.parent.children.length == 1) {
				if (d.data.direction == 'right') {
					if (d.parent.parent)
						moveNode(d, Math.abs(d.parent.x - d.parent.parent.x) / 2);
					else
						moveNode(d, width / 4);
				} else {
					if (d.parent.parent)
						moveNode(d, -Math.abs(d.parent.x - d.parent.parent.x) / 2);
					else
						moveNode(d, -width / 4);
				}
			}

			return "M" + d.x + "," + d.y +
				"C" + (d.x + d.parent.x) / 2 + "," + (d.y + d.parent.y) / 2 +
				" " + (d.x + d.parent.x) / 2 + "," + (d.y + d.parent.y) / 2 +
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
		.attr("r", 15);

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
