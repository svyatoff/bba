"use strict"


var getBadPhone = function(){
	var url 		= 'http://www.lun.ua/blacklist'; // ссылка на черный список агентств
	// var xpath 		= '/html/body/div[1]/div[2]/div[2]/ul/li[i]/a'; // путь к элементу
	// var csspath 		= 'body > div.global-wrapper.global-wrapper_with-sticky > div.center-wrapper > div.text-content > ul > li:nth-child(1) > a';

	// Проверяем статус ответа сервера
	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response
		} else {
			var error = new Error(response.statusText)
			error.response = response
			throw error
		}
	}
	// парсим полученные данные
	function parseText(response) {
		return response.text()
	}
	// очищаем от мусора, получаем необходимый нам список и формируем массив
	function cleanHtml(data){
		var array 			= new Array(), // объявляем массив для телефонов
			parser 			= new DOMParser(), // создаем DOM парсер
			regex 			= /\D/g, // регулярка для удаления лишних символов, только цифры
			doc 			= parser.parseFromString(data, 'text/html'),
			list 			= doc.body.children[0].children[1].children[1].children[3], // находим список телефонов
			lengthList 		= list.childElementCount; // узнаем его длину
		
		// var matches = doc.querySelectorAll("ul.first-symbol-list");
			
		
		for (var i = 0; i < lengthList; ++i) {
			var phone 		= list.children[i].children[0].innerText; // получаем телефон
			var clearPhone 	= phone.replace(regex, ''); // чистим cтроку от лишних символов
			array.push(clearPhone); // добавляем их в массив
		}
		return array
	}
	function addLocalStorage(array){
		var sObj = JSON.stringify(array); // сериализуем массив
		localStorage.setItem("phones", sObj); // запишем все телефоны в локальное хранилище
		var allPhones = localStorage.phones; // получаем все телефоны уже из локального хранилища
		return allPhones
	}

	var status 			= document.getElementById('status');
	var statusDelete 	= setTimeout(
		function() {
			status.innerHTML = '';
		}, 3000);

	// выполняем всю цепочку
	fetch(url)
		.then(checkStatus)
		.then(parseText)
		.then(cleanHtml)
		.then(addLocalStorage)
		.then(function(allPhones) {
			status.innerHTML = 'Телефоны в хранилище';
			statusDelete;
		}).catch(function(error) {
			status.innerHTML = error;
			statusDelete;
		})

};
// получаем телефоны из локального хранилища
var getLocalPhones = function(){
	var phones		= localStorage.phones,
		arrPhones 	= JSON.parse(phones);
	return arrPhones 
};
// сравниваем телефоны в хранилище и на странице
var comparePhones = function(tocompare) {
	var phoneStorage = getLocalPhones();

	function isBadPhone(elem, index, array){
		if(elem == tocompare){
			return elem
		} else {
			return false
		}
	}
	var	resultfind = phoneStorage.find(isBadPhone);
	console.log(resultfind);
};


window.onload = function () {
	var updatePhone = document.getElementById('updatePhone');
	var serchAction = document.getElementById('find');
	updatePhone.addEventListener('click', getBadPhone);
	serchAction.addEventListener('click', comparePhones);
}




// var optionsUrl = chrome.extension.getURL('options.html');
// chrome.tabs.query({url: optionsUrl}, function(tabs) {
//   if (tabs.length)
//     chrome.tabs.update(tabs[0].id, {active: true, url: optionsUrl});
//   else
//     chrome.tabs.create({url: optionsUrl});
// });