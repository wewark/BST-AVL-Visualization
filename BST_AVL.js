function Node(val = null) {
	this.value = val;
	this.parent = null;
	this.height = null;
	this.left = null;
	this.right = null;
	this.json = {
		name: this.value,
		direction: null,
		children: []
	};

	this.UpdateHeight = function() {
		var leftheigh = 0,
			rightheigh = 0;
		this.json.children = [];
		if (this.left) {
			leftheigh = this.left.height;

			// GUI
			this.json.children.push(this.left.json);
			this.left.json.direction = 'left';
		}
		if (this.right) {
			rightheigh = this.right.height;

			// GUI
			this.json.children.push(this.right.json);
			this.right.json.direction = 'right';
		}
		this.height = 1 + Math.max(leftheigh, rightheigh);
	}

	this.balancefactor = function() {
		var leftheigh = 0,
			rightheigh = 0;
		if (this.left)
			leftheigh = this.left.height;
		if (this.right)
			rightheigh = this.right.height;
		return leftheigh - rightheigh;
	}
}

function BSTAVL() {
	this.root = null;

	this.RotateRight = function(z) {
		var y = z.left,
			t3 = null;
		if (y)
			t3 = y.right;
		if (t3)
			t3.parent = z;

		y.right = z;
		z.left = t3;

		y.parent = z.parent;
		z.parent = y;

		z.UpdateHeight();
		y.UpdateHeight();
		return y;
	}

	this.RotateLeft = function(z) {
		var y = z.right,
			t2 = null;
		if (y)
			t2 = y.left;
		if (t2)
			t2.parent = z;


		y.left = z;
		z.right = t2;

		y.parent = z.parent;
		z.parent = y;

		z.UpdateHeight();
		y.UpdateHeight();
		return y;
	}

	this.balance = function(cur) {
		if (cur.balancefactor() == 2) ///left
		{
			if (cur.left.balancefactor() == -1) ///if this condition is valid so it is left right
				cur.left = this.RotateLeft(cur.left); ///here i convert it to left left

			/// when i do this i am pretty sure that i am in left left case so i convert it to a balance tree
			cur = this.RotateRight(cur);
		} else if (cur.balancefactor() == -2) ///right
		{

			if (cur.right.balancefactor() == 1) ///if this condition is valid so it is right left
				cur.right = this.RotateRight(cur.right); /// here i convert it to right right

			///when i do this i am pretty sure that i am in right right case so i convert it a balance tree
			cur = this.RotateLeft(cur);
		}
		return cur;
	}

	// Returns the node that contains val
	this.Search = function(val, cur = this.root) {
		if (cur == null)
			return -1;

		if (cur.value == val)
			return cur;
		if (val > cur.value)
			return this.Search(val, cur.right);
		return this.Search(val, cur.left);
	}

	this.Insert = function(cur, val) {
		if (cur == null)
			cur = new Node(val);
		else if (val <= cur.value) {
			cur.left = this.Insert(cur.left, val);
			cur.left.parent = cur;

			// GUI
			cur.left.json.direction = 'left';
			cur.json.children.push(cur.left.json);
		} else {
			cur.right = this.Insert(cur.right, val);
			cur.right.parent = cur;

			// GUI
			cur.right.json.direction = 'right';
			cur.json.children.push(cur.right.json);
		}

		cur.UpdateHeight();
		cur = this.balance(cur);
		return cur;
	}

	this.InsertVal = function(val) {
		this.root = this.Insert(this.root, val);
	}

	this.DeleteVal = function(val) {
		var node = this.Search(val);
		if (node == -1)
			return;

		this.Delete(node);
		this.root = this.balance(this.root)
	}

	this.Delete = function(cur) ///we will give it the pointer node we want to delete it , not the value , and after deleting we will call balance function given the cur
	{
		var prev, temp = cur;
		if (cur.right == null) {
			if (cur.parent.left == cur)
				cur.parent.left = cur.left;
			else
				cur.parent.right = cur.left;
			if (cur.left)
				cur.left.parent = cur.parent;

		} else if (cur.left == null) {
			if (cur.parent.left == cur)
				cur.parent.left = cur.right;
			else
				cur.parent.right = cur.right;
			if (cur.right)
				cur.right.parent = cur.parent;

		} else {
			temp = cur.left;
			prev = cur;
			while (temp.right != null) {
				prev = temp;
				temp = temp.right;
			}
			cur.value = temp.value;
			cur.json.name = cur.value;
			if (prev == cur)
				prev.left = temp.left;
			else
				prev.right = temp.left;

			prev.UpdateHeight();
			prev = this.balance(prev);
			while (prev.parent) {
				prev = prev.parent;
				prev.UpdateHeight();
				prev = this.balance(prev);
			}
			return;
		}

		while (cur.parent) {
			cur.UpdateHeight();
			cur = this.balance(cur);
			cur = cur.parent;
		}
		cur.UpdateHeight();
		this.root = this.balance(cur);
	}

	this.inorder = function(cur = this.root) {
		if (cur != null) {
			this.inorder(cur.left);
			console.log(cur.value);
			this.inorder(cur.right);
		}
	}

	// Returns a json of the whole tree
	this.getJSON = function(cur = this.root, direction = null) {
		var json = {
			name: cur.value,
			direction: direction,
			children: []
		}

		if (cur.left)
			json.children.push(this.getJSON(cur.left, 'left'));
		if (cur.right)
			json.children.push(this.getJSON(cur.right, 'right'));
		return json;
	}
}

var bst = new BSTAVL();
// for (var i = 0; i < 10; i++)
// 	bst.InsertVal(i);
// bst.DeleteVal(6);
// bst.inorder();
