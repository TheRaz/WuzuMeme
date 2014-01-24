var WuzuMeme = function (Template, Canvas, Top, Bottom, Settings) {

	if(!(Canvas instanceof HTMLCanvasElement)) {
		throw new Error('Canvas must be instanceof HTMLCanvasElement');
		return false;       
	}
	var image = new Image();
	image.src = Template;
	var context = Canvas.getContext('2d');

	var fragmentText = function(text, maxWidth) {
		text = text.toUpperCase();
		var words = text.split(' '),
		lines = [],
		line = "";
		if (context.measureText(text).width < maxWidth) {
			return [text];
		}
		while (words.length > 0) {
			while (context.measureText(words[0]).width >= maxWidth) {
				var tmp = words[0];
				words[0] = tmp.slice(0, -1);
				if (words.length > 1) {
					words[1] = tmp.slice(-1) + words[1];
				} else {
					words.push(tmp.slice(-1));
				}
			}
			if (context.measureText(line + words[0]).width < maxWidth) {
				line += words.shift() + " ";
			} else {
				lines.push(line);
				line = "";
			}
			if (words.length === 0) {
				lines.push(line);
			}
		}
		return lines;
	};

	var render = function() {

		var h = image.height;
		var w = image.width;
		var max_width = $('.canvas-col').width();
		while(w > max_width) {
			--h;
			--w;
		}

		Canvas.height = h;
		Canvas.width = w;

		context.clearRect(0, 0, w, h);
		context.drawImage(image, 0, 0, w, h);

		var fontTop     = Settings['fontTop'] || 45;
		var fontBottom  = Settings['fontBottom'] || 80;

		context.fillStyle   = Settings['fillStyle'] || 'white';
		context.strokeStyle = Settings['strokeStyle'] || 'black';
		context.lineWidth   =  Settings['lineWidth'] || '7';
		context.textAlign = Settings['textAlign'] || 'center';
		context.lineJoin = 'round';

		context.font = fontTop + 'px Impact';
		topLines = fragmentText(Top, (w - 40));

		$.each(topLines, function(i, line) {
			context.fillStyle = 'black';
			context.fillText(line, w / 2, 20 + (i+1)*fontTop);
			context.strokeText(line, w / 2, 20 + (i+1)*fontTop);
			context.fillStyle = 'white';
			context.fillText(line, w / 2, 20 + (i+1)*fontTop);
		});

		context.font = fontBottom + 'px Impact';
		bottomLines = fragmentText(Bottom, (w - 40));
		bottomLines = bottomLines.reverse();

		$.each(bottomLines, function(i, line) {
			context.fillStyle = 'black';
			context.fillText(line, w / 2, h - (20 + i*fontBottom));
			context.strokeText(line, w / 2, h - (20 + i*fontBottom));
			context.fillStyle = 'white';
			context.fillText(line, w / 2, h - (20 + i*fontBottom));
		});  
	};
	image.onload = function() {
		render();
	};

};
