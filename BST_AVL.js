function Node(val = null) {
	this.value = val;
	this.height = null;
	this.left = null;
	this.right = null;

	this.UpdateHeight = function() {
		var leftheigh = 0,
			rightheigh = 0;
		if (this.left)
			leftheigh = this.left.height;
		if (this.right)
			rightheigh = this.right.height;
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
		y.right = z;
		z.left = t3;

		z.UpdateHeight();
		y.UpdateHeight();
		return y;
	}

	this.RotateLeft = function(z) {
		var y = z.right,
			t2 = null;
		if (y)
			t2 = y.left;
		y.left = z;
		z.right = t2;

		z.UpdateHeight();
		y.UpdateHeight();
		return y;
	}

	this.balance = function(curr) {
		if (curr.balancefactor() == 2) ///left
		{
			if (curr.left.balancefactor() == -1) ///if this condition is valid so it is left right
				curr.left = this.RotateLeft(curr.left); ///here i convert it to left left

			/// when i do this i am pretty sure that i am in left left case so i convert it to a balance tree
			curr = this.RotateRight(curr);
		} else if (curr.balancefactor() == -2) ///right
		{

			if (curr.right.balancefactor() == 1) ///if this condition is valid so it is right left
				curr.right = this.RotateRight(curr.right); /// here i convert it to right right

			///when i do this i am pretty sure that i am in right right case so i convert it a balance tree
			curr = this.RotateLeft(curr);
		}
		return curr;
	}

	this.Insert = function(cur, val) {
		if (cur == null)
			cur = new Node(val);
		else if (val <= cur.value)
			cur.left = this.Insert(cur.left, val);
		else
			cur.right = this.Insert(cur.right, val);

		cur.UpdateHeight();
		cur = this.balance(cur);
		return cur;
	}

	this.InsertVal = function(val) {
		this.root = this.Insert(this.root, val);
	}

	this.Delete = function(root) ///we will give it the pointer node we want to delete it , not the value , and after deleting we will call balance function given the root
	{
		var prev, temp = root;
		if (root.right == NULL)
			root = root.left;
		else if (root.left == NULL)
			root = root.right;
		else {
			temp = root.left;
			prev = root;
			while (temp.right != NULL) {
				prev = temp;
				temp = temp.right;
			}
			root.value = temp.value;
			if (prev == root)
				prev.left = temp.left;
			else prev.right = temp.left;
		}
	}

	this.inorder = function(cur = this.root) {
		if (cur != null) {
			this.inorder(cur.left);
			console.log(cur.value);
			this.inorder(cur.right);
		}
	}

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
// for (var i = 0; i < 100; i++)
// 	bst.InsertVal(i);
// bst.inorder();
