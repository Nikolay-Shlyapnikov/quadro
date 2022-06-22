window.onload = function() {


    // const canvas2 = document.querySelector('#c2');
    // const context2 = canvas2.getContext("2d");
    FReader = new FileReader();
    const img = document.querySelector(".prew"),
        imgWrapper = document.querySelector('.img-wrapper'),
        //
        square = document.querySelector("#square"),
        topInput = document.querySelector('.top'),
        leftInput = document.querySelector('.left'),
        rotateInput = document.querySelector('.rotate-input'),

        //
        white = document.querySelector('.white'),
        lightGray = document.querySelector('.light-gray'),
        gray = document.querySelector('.gray'),
        darkGray = document.querySelector('.dark-gray'),
        black = document.querySelector('.black'),

        forCropCanvas = document.querySelector('.for-crop'),
        forCropContext = forCropCanvas.getContext("2d"),

        forFilterCanvas = document.querySelector('.for-filter'),
        forFilterContext = forFilterCanvas.getContext("2d"),



        version2Canvas = document.querySelector('.version2'),
        version2Context = version2Canvas.getContext("2d")



    var defaultImgWidth;
    var defaultImgHeight;
    var scale = 1;
    var imgCurrentHeight = 0;
    var imgCurrentWidth = 0;
    // выполнение функции при выборки файла
    document.querySelector(".file").addEventListener("change", loadImageFile);

    // функция выборки файла
    function loadImageFile() {
        var file = document.querySelector(".file").files[0];
        FReader.readAsDataURL(file);
    }

    // событие, когда файл загрузится
    FReader.onload = function(e) {
        img.src = e.target.result;
        img.onload = function() {
            defaultImgWidth = img.width;
            defaultImgHeight = img.height;
            if (defaultImgWidth > defaultImgHeight) {
                img.style.height = square.offsetWidth + 'px';
                img.style.minHeight = square.offsetWidth + 'px';
            } else {
                img.style.width = square.offsetWidth + 'px';
                img.style.minWidth = square.offsetWidth + 'px';
            }
            imgCurrentHeight = img.offsetHeight;
            imgCurrentWidth = img.offsetWidth;
            checkPosition();
        };
    };

    img.addEventListener('mouseover', function() {
        img.addEventListener('wheel', function(evt) {
            evt.preventDefault();
            if (evt.deltaY > 0) {
                if (scale >= 1) {
                    scale = scale - evt.deltaY * 0.0003;

                }
            }
            if (evt.deltaY < 0) {
                scale = scale - evt.deltaY * 0.0003;

            }
            img.style.transform = `rotate(${rotateInput.value}deg)scale(${scale})`;
            imgCurrentWidth = img.width * scale;
            imgCurrentHeight = img.height * scale;
            currentSize(imgWrapper);
            checkPosition();
        });
    });

    rotateLeft = document.querySelector('.rotate-left');
    rotateRight = document.querySelector('.rotate-right');

    rotateLeft.addEventListener('click', function(evt) {
        rotateInput.value = Number(rotateInput.value) - 90;
        img.style.transform = `rotate(${rotateInput.value}deg)scale(${scale})`;
        currentSize(imgWrapper);
        checkPosition();
    });
    rotateRight.addEventListener('click', function(evt) {
        rotateInput.value = Number(rotateInput.value) + 90;
        img.style.transform = `rotate(${rotateInput.value}deg)scale(${scale})`;
        currentSize(imgWrapper);
        checkPosition();
    });

    imgWrapper.addEventListener("mousedown", function(event) {

        let coordsItemX = event.clientX - imgWrapper.getBoundingClientRect().left;
        let coordsItemY = event.clientY - imgWrapper.getBoundingClientRect().top;

        let imgWrapperSizes = {
            width: imgWrapper.offsetWidth,
            height: imgWrapper.offsetHeight,
            left: imgWrapper.getBoundingClientRect().left + scrollX,
            top: imgWrapper.getBoundingClientRect().top + scrollY,
            right: imgWrapper.getBoundingClientRect().left + scrollX + imgWrapper.offsetWidth,
            bottom: imgWrapper.getBoundingClientRect().top + scrollY + imgWrapper.offsetHeight
        }
        let squareSizes = {
            width: square.offsetWidth,
            height: square.offsetHeight,
            left: square.getBoundingClientRect().left + scrollX,
            top: square.getBoundingClientRect().top + scrollY,
            right: square.getBoundingClientRect().left + scrollX + square.offsetWidth,
            bottom: square.getBoundingClientRect().top + scrollY + square.offsetHeight
        }

        imgWrapper.style.position = 'absolute';

        moveItem(event.pageX, event.pageY);

        function moveItem(pageX, pageY) {
            let currentX = pageX - coordsItemX - squareSizes.left;
            let currentY = pageY - coordsItemY - squareSizes.top;

            if (
                currentX + imgWrapperSizes.width >= squareSizes.width &&
                currentX <= 0
            ) {
                imgWrapper.style.left = `${currentX}px`;
            } else {
                if (currentX + imgWrapperSizes.width < squareSizes.width) {
                    imgWrapper.style.left = `${squareSizes.width-imgWrapperSizes.width}px`;
                }
                if (currentX > 0) {
                    imgWrapper.style.left = `${0}px`;
                }
            }
            if (
                currentY + imgWrapperSizes.height >= squareSizes.height &&
                currentY <= 0
            ) {
                imgWrapper.style.top = `${currentY}px`;
            } else {
                if (currentY + imgWrapperSizes.height < squareSizes.height) {
                    imgWrapper.style.top = `${squareSizes.height-imgWrapperSizes.height}px`;
                }
                if (currentY > 0) {
                    imgWrapper.style.top = `${0}px`;
                }
            }
            checkPosition();
        }

        function onDragItem(event) {
            moveItem(event.pageX, event.pageY);
        }
        document.addEventListener('mousemove', onDragItem);

        document.addEventListener("mouseup", function(event) {
            document.removeEventListener('mousemove', onDragItem);
        }, { "once": true });
    });
    imgWrapper.addEventListener("dragstart", function(event) {
        event.preventDefault();
    });


    function currentSize(elem) {
        elem.style.width = img.getBoundingClientRect().right - img.getBoundingClientRect().left + `px`;
        elem.style.height = img.getBoundingClientRect().bottom - img.getBoundingClientRect().top + `px`;
    }




    function checkPosition() {
        imgPosition = img.getBoundingClientRect();
        squarePosition = square.getBoundingClientRect();
        topInput.value = Math.round(imgPosition.top - squarePosition.top);
        leftInput.value = Math.round(imgPosition.left - squarePosition.left);
    }
    var drawCanvas = document.querySelector('.draw');
    drawCanvas.addEventListener('click', canvasDraw);

    function canvasDraw() {
        forCropCanvas.height = square.offsetHeight;
        forCropCanvas.width = square.offsetWidth;
        forCropContext.save();
        forCropContext.translate(forCropCanvas.offsetWidth / 2, forCropCanvas.offsetHeight / 2);
        forCropContext.fillRect(0, 0, 100, 100);
        forCropContext.rotate(rotateInput.value * (Math.PI / 180));
        forCropContext.drawImage(img, leftInput.value - forCropCanvas.offsetWidth / 2, topInput.value - forCropCanvas.offsetHeight / 2, imgCurrentWidth, imgCurrentHeight);
        forCropContext.rotate(-(rotateInput.value * (Math.PI / 180)));
        forCropContext.restore();
        Filter();
        version2Canvas.height = square.offsetHeight;
        version2Canvas.width = square.offsetWidth;
        pixelisation(128, forCropContext, version2Context, 0);
    }

    function Filter() {
        var imgData = forCropContext.getImageData(0, 0, square.offsetWidth, square.offsetHeight);
        forFilterCanvas.width = square.offsetWidth;
        forFilterCanvas.height = square.offsetHeight;
        // циклически преобразуем массив, изменяя значения красного, зеленого и синего каналов

        imgDataFiltered = grayFilter(imgData);

        function grayFilter(imgData) {
            // получаем одномерный массив, описывающий все пиксели изображения
            var pixels = imgData.data;
            // циклически преобразуем массив, изменяя значения красного, зеленого и синего каналов
            for (var i = 0; i < pixels.length; i += 4) {
                var r = pixels[i];
                var g = pixels[i + 1];
                var b = pixels[i + 2];
                pixels[i] = (r + g + b) / 3; // red
                pixels[i + 1] = (r + g + b) / 3; // green
                pixels[i + 2] = (r + g + b) / 3; // blue
            }
            return imgData;
        };
        forFilterContext.putImageData(imgDataFiltered, 0, 0);
    };

    function pixelisation(countCells, contextStart, contextResult, version) {
        let cellSize = square.offsetWidth / countCells;

        if (version == 0 || version == 1 || version == 2) {
            for (let i = 0; i * cellSize < square.offsetHeight; i++) {
                for (let j = 0; j * cellSize < square.offsetWidth; j++) {
                    if ((0 <= getAverange(contextStart, version, cellSize * i, cellSize * j, cellSize, cellSize)) && (getAverange(contextStart, version, cellSize * i, cellSize * j, cellSize, cellSize) < 51)) {
                        contextResult.drawImage(black, cellSize * i, cellSize * j, cellSize, cellSize)
                    }
                    if ((51 <= getAverange(contextStart, version, cellSize * i, cellSize * j, cellSize, cellSize)) && (getAverange(contextStart, version, cellSize * i, cellSize * j, cellSize, cellSize) < 102)) {
                        contextResult.drawImage(darkGray, cellSize * i, cellSize * j, cellSize, cellSize)
                    }
                    if ((102 <= getAverange(contextStart, version, cellSize * i, cellSize * j, cellSize, cellSize)) && (getAverange(contextStart, version, cellSize * i, cellSize * j, cellSize, cellSize) < 153)) {
                        contextResult.drawImage(gray, cellSize * i, cellSize * j, cellSize, cellSize)
                    }
                    if ((153 <= getAverange(contextStart, version, cellSize * i, cellSize * j, cellSize, cellSize)) && (getAverange(contextStart, version, cellSize * i, cellSize * j, cellSize, cellSize) < 204)) {
                        contextResult.drawImage(lightGray, cellSize * i, cellSize * j, cellSize, cellSize)
                    }
                    if ((204 <= getAverange(contextStart, version, cellSize * i, cellSize * j, cellSize, cellSize)) && (getAverange(contextStart, version, cellSize * i, cellSize * j, cellSize, cellSize) < 255)) {
                        contextResult.drawImage(white, cellSize * i, cellSize * j, cellSize, cellSize)
                    }

                }
            }
        }

        function getAverange(contextStart, version, x, y, width, height) {
            var grayData = contextStart.getImageData(x, y, width, height)
            var grayPixels = grayData.data;
            let Average = 0;
            let countElments = 0;
            for (var i = 0; i < grayPixels.length; i += 4) {
                Average = Average + grayPixels[i + version];
                countElments++;
            }
            result = Math.round(Average / countElments);

            return result;
        };

        function getSelectArrayElement(color) {
            if ((0 <= color) && (color < 70)) {
                return 1;
            }
            if ((70 <= color) && (color < 130)) {
                return 2;
            }
            if ((130 <= color) && (color < 180)) {
                return 3;
            }
            if ((180 <= color) && (color < 220)) {
                return 4;
            }
            if ((220 <= color) && (color < 255)) {
                return 5;
            }
        };

        function selectCellColor(contextStart, x, y, width, height) {
            let colorArr = [];
            colors = getAverangeOfSums(contextStart, x, y, width, height);
            colorArr.push(getSelectArrayElement(colors.avgR));
            colorArr.push(getSelectArrayElement(colors.avgG));
            colorArr.push(getSelectArrayElement(colors.avgB));
            result = Math.ceil((colorArr[0] + colorArr[1] + colorArr[2]) / 3);
            return result;

        }

        function getAverangeOfSums(contextStart, x, y, width, height) {
            var imgData = contextStart.getImageData(x, y, width, height)
            var pixels = imgData.data;
            let sumR = 0;
            let sumG = 0;
            let sumB = 0;
            let countElments = 0;
            for (var i = 0; i < pixels.length; i += 4) {
                sumR = sumR + pixels[i];
                sumG = sumG + pixels[i + 1];
                sumB = sumB + pixels[i + 2];
                countElments++;
            }
            result = {
                avgR: sumR / countElments,
                avgG: sumG / countElments,
                avgB: sumB / countElments
            }
            return result;
        };


    };



}