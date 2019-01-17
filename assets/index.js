var mainApp = angular.module("mainApp", []);

mainApp.controller('mainAppController', function($rootScope, $scope, $compile, $q, $http) {
	
	let cols1 = 1;
	let cols2 = 1;
	let cols3 = 1;
	const length = 12;
	const API_KEY = 'AIzaSyCG6wKJIQq70n8YFrkF1jC97jxjxBjK7BM';
	
	var services = [
		{
			'name': 'Map of a place or address',
			'src': 'https://www.google.com/maps/embed/v1/place?key=' + API_KEY + '&q=Thessaloniki',
			'type': 'Service'
		},
		{
			'name': 'Map of search results',
			'src': 'https://www.google.com/maps/embed/v1/search?key=' + API_KEY + '&q=record+stores+in+Seattle',
			'type': 'Service'
		},
		{
			'name': 'Map of driving directions',
			'src': 'https://www.google.com/maps/embed/v1/directions?key=' + API_KEY + '&origin=Oslo+Norway&destination=Telemark+Norway',
			'type': 'Service'
		},
		{
			'name': 'Map of specific area',
			'src': 'https://www.google.com/maps/embed/v1/view?key=' + API_KEY + '&center=-33.8569,151.2152&zoom=18',
			'type': 'Service'
		},
		{
			'name': 'Street View',
			'src': 'https://www.google.com/maps/embed/v1/streetview?key=' + API_KEY + '&location=46.414382,10.013988',
			'type': 'Service'
		},
		{
			'name': 'Temperature Map',
			'src': 'https://darksky.net/map-embed/@temperature,39.000,-95.000,4.js?embed=true&timeControl=true&fieldControl=true&defaultField=temperature&defaultUnits=_c',
			'type': 'Service'
		}
	];
	
	$scope.options = services;
		
	try {
		$http({
			method: 'GET',
			url: '/dbactions'
		}).then(function success(res) {
			res.data.forEach((data) => { $scope.options.push(data) });
			sessionStorage['graphs'] = res.data;
		}, function error(res) {
			console.log(res);
		});
	} catch {
		sessionStorage['graphs'].forEach((data) => { $scope.options.push(data) });
	}
	
	$http({
		method: 'GET',
		url: '/dbactions/components/' + window.location.href.replace(window.location.origin + '/?', '')
	}).then(function success(res) {
		res.data.forEach((data) => { $scope.options.push(data) });
	}, function errpr(res) {
		console.log(res);
	});
	
	$scope.addColumn = function(area, row) {
		$('#' + row).empty();
		
		if (area == 'area1') {
			if (cols1 <= 11) cols1 += 1;
			appendToElement(row, cols1, 1);
		} else if (area == 'area2') {
			if (cols2 <= 11) cols2 += 1;
			appendToElement(row, cols2, 2);
			
		} else {
			if (cols3 <= 11) cols3 += 1
			appendToElement(row, cols3, 3);
		}
			
	};
	
	appendToElement = function(row, col, type) {
		let pieces = Math.floor(length/col);
		let start;
		
		if (type == 1) start = 0;
		else if (type == 2) start = 12;
		else start = 24;
		
		for (let i = start; i < start + col; i++) {
			let select = '<select style="width: 45%" class="float-lg-right" ng-options="option.name group by option.type for option in options" ng-model="selected' + i + '" ng-change="selectService(selected' + i + ',\'select' + i + '\')"><option value="" disabled selected> Select Tile </option></select><br><br>';
			let temp = '<div id="select' + i + '" class="col-md-' + pieces + ' text-center" style="word-break: break-all;">' + select + '</div>';

			$('#' + row).append(temp);
		}
		$compile($('#' + row))($scope);
	};
	
	render = function(spec, id) {
		view = new vega.View(vega.parse(spec))
		.renderer('canvas')    // set renderer (canvas or svg)
		.initialize('#' + id)  // initialize view within parent DOM container
		.hover()               // enable hover encode set processing
		.run();
	}
	
	$scope.selectService = function(tile, id) {
		$('#' + id + id).remove();
	
		let width = parseInt($('#' + id).width()) - 20;
		
		if (tile.type == 'Service') {
			let tmp = '<iframe id="' + id + id + '" frameborder="0" width="90%" height="' + width + '" style="border:0" src="' + tile.src + '" allowfullscreen></iframe>';
			$('#' + id).append(tmp);
			$compile($('#' + id))($scope);
		} else if (tile.type == 'Graph') {
			let tmp = '<div id="' + id + id + '"></div>';
			tile.src.width = width;
			tile.src.height = width;
			tile.src.padding = 0;
			$('#' + id).append(tmp);
			$compile($('#' + id))($scope);
			render(tile.src, id + id);
		} else {
			let tmp = '<div id="' + id + id + '">' + tile.src + '</div>';
			$('#' + id).append(tmp);
			//$compile($('#' + id))($scope);
			
			$(function () {
		      //Initialize Select2 Elements
		      $('.select2').select2()
		      //Datemask dd/mm/yyyy
		      $('#datemask').inputmask('dd/mm/yyyy', { 'placeholder': 'dd/mm/yyyy' })
		      //Datemask2 mm/dd/yyyy
		      $('#datemask2').inputmask('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' })
		      //Money Euro
		      $('[data-mask]').inputmask()
		      //Date range picker
		      $('#reservation').daterangepicker()
		      //Date range picker with time picker
		      $('#reservationtime').daterangepicker({ timePicker: true, timePickerIncrement: 30, format: 'MM/DD/YYYY h:mm A' })
		      //Date range as a button
		      $('#daterange-btn').daterangepicker(
				  {
				    ranges   : {
				    'Today'       : [moment(), moment()],
				    'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				    'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
				    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				    'This Month'  : [moment().startOf('month'), moment().endOf('month')],
				    'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				    },
				    startDate: moment().subtract(29, 'days'),
				    endDate  : moment()
				  },
				  function (start, end) {
				    $('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
				  }
		      )
		        //Date picker
		      $('#datepicker').datepicker({
		        autoclose: true
		      })
		      //iCheck for checkbox and radio inputs
		      $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
		        checkboxClass: 'icheckbox_minimal-blue',
		        radioClass   : 'iradio_minimal-blue'
		      })
		      //Red color scheme for iCheck
		      $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
		        checkboxClass: 'icheckbox_minimal-red',
		        radioClass   : 'iradio_minimal-red'
		      })
		      //Flat red color scheme for iCheck
		      $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
		        checkboxClass: 'icheckbox_flat-green',
		        radioClass   : 'iradio_flat-green'
		      })
		      //Colorpicker
		      $('.my-colorpicker1').colorpicker()
		      //color picker with addon
		      $('.my-colorpicker2').colorpicker()
		      //Timepicker
		      $('.timepicker').timepicker({
		        showInputs: false
		      })
		      $('.slider').slider()

		      // Replace the <textarea id="editor1"> with a CKEditor
		      // instance, using default configuration.
		      CKEDITOR.replace('editor1')
		      //bootstrap WYSIHTML5 - text editor
		      $('.textarea').wysihtml5()

		      $('#example1').DataTable()
		      $('#example2').DataTable({
		        'paging'      : true,
		        'lengthChange': false,
		        'searching'   : false,
		        'ordering'    : true,
		        'info'        : true,
		        'autoWidth'   : false
		      })
		      
		    });
			
		}
		
	};
});

