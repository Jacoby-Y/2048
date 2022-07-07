<script>
  let board = [
		0,0,0,0,
		0,2,0,0,
		0,0,0,0,
		0,0,0,0,
	];

	// let board = [
	// 	2,8,4,2,
	// 	4,128,32,8,
	// 	32,8,16,2,
	// 	2,4,2,4
	// ];

	// let board = [
	// 	2, 2, 2, 2,
	// 	2, 2, 2, 2,
	// 	2, 2, 2, 2,
	// 	2, 2, 2, 2,
	// ];

	const bg_colors = {
		0: "#cdc1b5",
		2: "#eee4da",
		4: "#ece0c8",
		8: "#f2b179",
		16: "#f59563",
		32: "#f57c5f",
		64: "#ff3d39",
		128: "#f0d46e",
		256: "#f0d15c",
		512: "#f1cd4b",
		1024: "#f2ca38",
		2048: "#f2c724",
		4096: "#3c382f",
	}
	const txt_colors = {
		0: "#000",
		2: "#000",
		4: "#000",
		8: "#fff",
	}

	const shift = {
		up() {
			const new_board = [];
			for (let i = 0; i < 4; i++) {
				const hold = board.filter((v,j)=> j%4 == i).filter(v => v > 0);
				const col = hold.filter(v => v != 0);
				const len = col.length;
				for (let j = 0; j < 4-len; j++) col.push(0);
				new_board.push(col);
			}

			for (let x = 0; x < new_board.length; x++) {
				const col = new_board[x];
				for (let y = 0; y < col.length; y++) {
					const n = col[y];
					board[y*4+x] = n;
				}
			}
			board = board;
			return board.join("");
		},
		right() {
			const new_board = [];
			for (let i = 0; i < 4; i++) {
				const hold = board.filter((v,j)=> Math.floor(j/4)==i);
				const row = hold.filter(v => v != 0);
				const len = row.length;
				for (let j = 0; j < 4-len; j++) row.push(0);
				new_board.push(row.reverse());
			}
			board = new_board[0].concat(new_board[1], new_board[2], new_board[3]);
			return board.join("");
		},
		down() {
			const new_board = [];
			for (let i = 0; i < 4; i++) {
				const hold = board.filter((v,j)=> j%4 == i).filter(v => v > 0);
				const col = hold.filter(v => v != 0);
				const len = col.length;
				for (let j = 0; j < 4-len; j++) col.push(0);
				new_board.push(col.reverse());
			}
			for (let x = 0; x < new_board.length; x++) {
				const col = new_board[x];
				for (let y = 0; y < col.length; y++) {
					const n = col[y];
					board[y*4+x] = n;
				}
			}
			board = board;
			return board.join("");
		},
		left() {
			const new_board = [];
			for (let i = 0; i < 4; i++) {
				const hold = board.filter((v,j)=> Math.floor(j/4)==i);
				const row = hold.filter(v => v != 0);
				const len = row.length;
				for (let j = 0; j < 4-len; j++) row.push(0);
				new_board.push(row);
			}
			board = new_board[0].concat(new_board[1], new_board[2], new_board[3]);
			return board.join("");
		},
	}
	const merge = {
		up() {
			for (let i = 0; i < board.length; i++) {
				if (board[i+4] == undefined) continue;
				if (board[i] == board[i+4]) {
					board[i+4] = 0
					board[i] *= 2
				}
			}
		},
		right() {
			for (let i = board.length-1; i >= 0; i--) {
				if (i % 4 == 0) continue;
				if (board[i] == board[i-1]) {
					board[i-1] = 0
					board[i] *= 2
				}
			}
		},
		down() {
			for (let i = board.length-1; i >= 0; i--) {
				if (i < 4) continue;
				if (board[i] == board[i-4]) {
					board[i-4] = 0
					board[i] *= 2
				}
			}
		},
		left() {
			for (let i = board.length-1; i >= 0; i--) {
				if (i % 4 == 3) continue;
				if (board[i] == board[i+1]) {
					board[i+1] = 0
					board[i] *= 2
				}
			}
		}
	}
	const can_move = ()=>{
		if (board.includes(0)) return true;
		for (let i = 0; i < board.length; i++) {
			const n = board[i];
			const top = (i > 3 ? board[i-4] : undefined);
			const right = (i%4 != 3 ? board[i+1] : undefined);
			const down = (i < board.length-4 ? board[i+4] : undefined);
			const left = (i%4 != 0 ? board[i-1] : undefined);
			if (top != undefined && top == n) return true;
			if (right != undefined && right == n) return true;
			if (down != undefined && down == n) return true;
			if (left != undefined && left == n) return true;
		}
		return false;
	}
	const move = (dir)=>{
		if (!can_move()) {
			lost = true
			return;
		}
		const bef = board.join("");
		shift[dir]();
		merge[dir]();
		const aft = shift[dir]();
		if (bef != aft) spawn();
	}
	const spawn = ()=>{
		const avail = [];
		for (let i = 0; i < board.length; i++) {
			const n = board[i];
			if (n == 0) {
				avail.push(i)
			}
		}
		if (avail.length <= 0) return;
		const rand_i = Math.floor(Math.random()*avail.length);
		board[avail[rand_i]] = 2;
	}

	const boardString = ()=>{
		return board.map((v,i)=> (i%4 == 0 ? `\n${v}` : `${v}`)).join(" ").trim();
	}
	
	window.onkeyup = ({key})=>{
		key = key.toLowerCase();
		if (lost) return;
		else if (key == "w") move("up");
		else if (key == "d") move("right");
		else if (key == "s") move("down");
		else if (key == "a") move("left");
		else if (key.slice(0,5) == "arrow") move(key.slice(5));
		else if (key.slice(0,5) == "arrow") move(key.slice(5));
		else if (key == "b") console.log(boardString());
		else if (key == "c") console.clear();
	}

	let lost = false;
	const restart = ()=>{
		board = [
			0, 0, 0, 0,
			0, 2, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
		];
		lost = false;
	}
	
	let debug = false;
	const toggleDebug = ()=>{
		debug = !debug;
	}
</script>

<main>
	<div id="debug-btn" on:click={toggleDebug}>Debug Mode</div>
  {#each board as num, i}
		<div class="tile tile-{num}" style="background-color: {bg_colors[num]}; color: {txt_colors[Math.min(num, 8)]};" class:glow={num >= 512}>
			<span>{num > 0 ? num : ""}</span>
			{#if debug} <p class="debug">{`x: ${i%4}, y: ${Math.floor(i/4)}`}</p> {/if}
		</div>
	{/each}
	{#if lost}
		<div id="lose-wrapper">
			<h1>Uh oh... You lose!</h1>
			<button on:click={restart}>Start over</button>
		</div>
	{/if}
</main>

<style>
  main {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(4, 1fr);
		gap: 1rem;
		padding: 1rem;
		border-radius: 0.5rem;
		border-top-right-radius: 0;
		background-color: #baac9e;
		position: relative;
	}
	#debug-btn {
		position: absolute;
		right: 0;
		bottom: 100%;
		background-color: #baac9e;
		padding: 1rem 1.2rem;
		font-weight: bold;
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
		cursor: pointer;
	}
	#debug-btn:hover {
		background-color: #a89a8b;
	}
	.tile {
		border-radius: 0.5rem;
		width: 8rem;
		height: 8rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #cdc1b5;
		font-size: 2rem;
		font-weight: bold;
		position: relative;
	}
	.tile .debug {
		position: absolute;
		left: 0;
		top: 0;
		font-size: 1rem;
		padding: 0.3rem 0.6rem;
		font-weight: normal;
	}
	.glow {
		box-shadow: 0 0 3px white;
	}

	#lose-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #00000099;
		border-radius: 0.5rem;
		border-top-right-radius: 0;
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
	#lose-wrapper button {
		padding: 1rem 1.2rem;
		border: none;
		background-color: #777;
		color: white;
		font-size: 1.2rem;
		font-weight: bold;
		cursor: pointer;
	}
	#lose-wrapper button:hover {
		background-color: #808080;
	}
</style>
