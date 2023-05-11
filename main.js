function createBadge() {

  var fullname = document.getElementById('fullname').value;
  var date = document.getElementById('date').value;
  var end_date = document.getElementById('end_date').value;
  var course = document.getElementById('course').value;

  if (fullname == '') {
    alert('Введіть ПІБ')
    return;
  }

  if (course == '') {
    alert('Введіть назву курса')
    return;
  }

  if (date == '') {
    alert('Введіть дату отримання')
    return;
  }

  if (end_date == '') {
    alert('Введіть дату закінчення терміну дії')
    return;
  }

  if(date > end_date){
    alert('Дата отримання не може буди меншою за дату закінчення дії бейджу')
    return;
  }


  const regexForName = /^([А-ЯЇІЄ]{1,1})([а-яїіє]{2,15})+\s([А-ЯЇІЄ]{1,1})([а-яїіє]{1,15})+\s([А-ЯЇІЄ]{1,1})([а-яїіє]{2,15})+$/;
  if (regexForName.test(fullname)) {
    console.log("ПІБ введено правильно");
  } else {
    alert("ПІБ введено неправильно")
    return;
  }


  const canvasContainer = document.createElement('div');
  canvasContainer.classList.add('canvas-container')
  document.body.appendChild(canvasContainer);
  const canvas = new fabric.Canvas('canvas', {
    width: canvasContainer.clientWidth,
    height: canvasContainer.clientHeight,
  });

  canvas.setWidth(960);
  canvas.setHeight(540);

  canvasContainer.appendChild(canvas.lowerCanvasEl);

  const maxWidth = canvas.width;
  const maxHeight = canvas.height;

  fabric.Image.fromURL('images/Електронний бейдж.png', function (img) {
    var scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);
    img.scaleToWidth(img.width * scaleFactor);
    img.scaleToHeight(img.height * scaleFactor);
    canvas.add(img);

    canvas.sendToBack(img);

    // Створюємо об'єкти текста

    var courseText = new fabric.Text(course, {
      left: 250,
      top: 250,
      fontSize: 40,
      fill: 'white'
    });
    canvas.add(courseText);

    var fullnameText = new fabric.Text(fullname, {
      left: 130,
      top: 150,
      fontSize: 50,
      fill: 'white'
    });
    canvas.add(fullnameText);

    var dateText = new fabric.Text(date, {
      left: 250,
      top: 408,
      fontSize: 32,
      fill: 'white'
    });
    canvas.add(dateText);

    var end_dateText = new fabric.Text(end_date, {
      left: 700,
      top: 408,
      fontSize: 32,
      fill: 'white'
    });
    canvas.add(end_dateText);

    var uniqueCode = new fabric.Text(generateUniqueCode(), {
      left: 20,
      top: 20,
      fontSize: 16,
      fill: 'white'
    });
    canvas.add(uniqueCode);

    canvas.renderAll();

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Завантажити';
    downloadBtn.addEventListener('click', () => {
      const url = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'myCanvas.png';

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      const sendToDB = document.createElement('a');
      sendToDB.href = '/save';

      document.body.appendChild(sendToDB);
      sendToDB.click();
      document.body.removeChild(sendToDB);
      sendBadgeInfoToServer(uniqueCode.text, fullname, date, course, end_date)

    });

    document.body.appendChild(downloadBtn);
  });

}

function generateUniqueCode() {
  const timestamp = Date.now().toString();
  const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  return timestamp + randomDigits;
}

function sendBadgeInfoToServer(number, fullname, date, course, end_date) {
  const badge = {
    number: number,
    fullname: fullname,
    date: date,
    end_date: end_date,
    course: course,
  };

  fetch('http://localhost:3000/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(badge)
  })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
    });
}