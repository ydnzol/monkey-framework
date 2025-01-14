﻿var color='#FFF',color_t='#FF0';

var chart_btm=null;
function BTM(){
	if(chart_btm != null){chart_btm.destroy()}
	var data=getbtm();
	chart_btm=new Highcharts.Chart({
		chart: {
			renderTo: 'btm',
			type: 'line'
		},
		title: {text: '电量走势图'},
		credits: {enabled: false},
		xAxis: {
			title: {text: 'Uptime(s)'},
			floor: data[0][0],
			type: 'category',
			categories: data[0]
		},
		yAxis: [
			{title: {text: '%'},min:0},
			{title: {text: null},opposite: true}
		],
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			line:{
				turboThreshold:0
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function (){
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + '%</b></td></tr>';
				});
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var chart_cpu=null;
function cpu(){
	if(chart_cpu != null){chart_cpu.destroy()}
	var data=getcpu();
	chart_cpu=new Highcharts.Chart({
		chart: {
			renderTo: 'cpu',
			type: 'line'
		},
		title: {text: '系统CPU走势图'},
		credits: {enabled: false},
		xAxis: {
			title: {text: 'Uptime(s)'},
			floor: data[0][0],
			type: 'category',
			categories: data[0]
		},
		yAxis: {
			title: {text:'cpu(%)'},
			floor: 0,
			max: 100
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			line:{
				turboThreshold:0
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function (){
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + '%</b></td></tr>';
				});
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

function cpuinfolist(){
	var el=$("#cpuinfolist").multiselect({
		selectedText: function(numChecked, numTotal, checkedItems){
			return '已选：' + numChecked + '/' + numTotal;
		},
		checkAllText: "全选",
		uncheckAllText: "全不选",
		minWidth: 350,
		height: 140,
		show: ["bounce", 200],
		hide: ["explode", 1000],
		close: function(){
			var list=jQuery("#cpuinfolist").val();
			if(list != null){
				cpulist=[]
				for (var i=0; i < list.length; i++){cpulist.push(list[i].split(","))};
//				console.log(cpulist);
				chart_cpuinfo=null;
				cpuinfo(cpulist);
			}
		}
	}).multiselectfilter({
		label: '查找:',
		placeholder: '输入关键字'
	});
	for (var i=0; i < cpuline.length; i++){
		var v=cpuline[i], opt=$('<option />', {
			value: [v[0],v[1]],
			text: v[0] + '(' + v[2] + ')'
		});
		opt.appendTo(el);
		if(i<5){opt.attr('selected',true)}
	};
	el.multiselect('refresh');
}

var chart_cpuinfo=null;
function cpuinfo(a){
	if(chart_cpuinfo != null){chart_cpuinfo.destroy()}
	var data=getcpuinfo(a);
	var x_min=data[0][0][0][0];
	var x_max=data[0][0][0][data[0][0][0].length-1];
	for (var i=1; i < a.length; i++){
		if(data[0][i][0][0] < x_min){x_min=data[0][i][0][0]};
		if(data[0][i][0][data[0][i][0].length-1] > x_max){x_max=data[0][i][0][data[0][i][0].length-1]}
	}
	chart_cpuinfo=new Highcharts.Chart({
		chart: {
			renderTo: 'cpuinfo',
			type: 'line'
		},
		title: {
			text: '进程CPU走势图'
		},
		credits: {
			enabled: false
		},
		xAxis: {
			title: {text: 'Uptime(s)'},
			floor: x_min,
			max: x_max
		},
		yAxis: {
			title: {text:'cpu(%)'},
			floor: 0,
			max: 100
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			line:{
				turboThreshold:0
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var total=0;
				var P=0;
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function (){
					total=total.add(this.y);
					var arg='null';
					var Thread='null';
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + '%</b></td></tr>';
					for (var i=P; i < a.length; i++){
						if(data[1][i].name == this.series.name){
							P=i+1;
							var p=isHasElement(data[0][i][0],this.x);
							if(p != -1){
								arg=data[0][i][1][p];
								Thread=data[0][i][2][p]
							}
							break;
						}
					}
					if(arg != 'null'){
						s += '<tr><td style="color: ' + this.series.color + '">' + 'ARG:</td>' +
							'<td style="text-align: left; color: '+ color + '"><b>' + arg +'</td>' + '</b></td></tr>';
					};
					if(Thread != 'null'){
						s += '<tr><td style="color: ' + this.series.color + '">' + 'Thread:</td>' +
							'<td style="text-align: left; color: '+ color + '"><b>' + Thread +'</td>' + '</b></td></tr>';
					}
				});
				s += '<tr><td style="color: '+ color + '">Total:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + total + '%</b></td></tr>';
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var chart_mem=null;
var mem_map="all";
function mem(a){
	mem_map=a;
	if(chart_mem != null){chart_mem.destroy()}
	var data=getmem(a);
	chart_mem=new Highcharts.Chart({
		chart: {
			renderTo: 'mem',
			type: 'line'
		},
		title: {
			text: '系统内存走势图'
		},
		credits: {
			enabled: false
		},
		xAxis: {
			title: {text: 'Uptime(s)'},
			floor: data[0][0],
			type: 'category',
			categories: data[0]
		},
		yAxis: {
			title: {text:'内存(M)'},
			floor: 0
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			line:{
				turboThreshold:0
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function (){
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + 'M</b></td></tr>';
				});
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var chart_mem2=null;
var mem2_map='mmap';
function mem2(a){
	mem2_map=a;
	if(chart_mem2 != null){chart_mem2.destroy()}
	var data=getmem2(a);
	chart_mem2=new Highcharts.Chart({
		chart: {
			renderTo: 'mem2',
			type: 'line'
		},
		title: {
			text: "Meminfo系统内存分类走势"
		},
		credits: {
			enabled: false
		},
		xAxis: {
			title: {text: 'Uptime(s)'},
			floor: data[0][0],
			type: 'category',
			categories: data[0]
		},
		yAxis: {
			title: {text:"内存(M)"}
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			line:{
				turboThreshold:0
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function (){
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + 'M</b></td></tr>';
				});
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var command=0;
function meminfolist(){
	var el=$("#meminfo_select").multiselect({
		multiple: false,
		noneSelectedText: "选择进程",
		minWidth: 560,
		height: 140,
		selectedList: 1,
	}).multiselectfilter({
		label: '查找:',
		placeholder: '输入关键字'
	});
	for (var i=0; i < pssline.length; i++){
		var v=pssline[i], opt=$('<option />', {
			value: v[1],
			text: v[0] + '(' + v[2] + "|" + v[3] + ')'
		});
		opt.appendTo(el);
		if(i==0){
			command=v[1];
			opt.attr('selected',true)
		}
	};
	el.multiselect('refresh');
}

var chart_meminfo=null;
function meminfo(a){
	command=a;
	if(chart_meminfo != null){chart_meminfo.destroy()}
	var data=getmeminfo(a);
	chart_meminfo=new Highcharts.Chart({
		chart: {
			renderTo: 'meminfo',
			type: 'line'
		},
		title: {
			text: '进程内存走势图'
		},
		credits: {
			enabled: false
		},
		xAxis: {
			title: {text: 'Uptime(s)'},
			floor: data[0][0][0],
			max: data[0][0][data[0][0].length-1]
		},
		yAxis: [
			{labels: {format: '{value}M'},title: {text:'memory(M)'}},
			{labels: {format: '{value}'},title: {text:'num'},opposite: true}
		],
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			line:{
				turboThreshold:0
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var p1=isHasElement(data[0][0],this.x);
				var arg=data[0][1][p1]
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function (){
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + '</b></td></tr>';
				});
				if(arg!='null'){
					s += '<tr><td style="color: ' + color + '">' + 'ARG:</td>' +'<td style="text-align: left; color: '+ color + '"><b>' + arg +'</td>' + '</b></td></tr>';
				}
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var command2=0;
function meminfo2list(){
	var el=$("#meminfo2_select").multiselect({
		multiple: false,
		noneSelectedText: "选择进程",
		minWidth: 560,
		height: 140,
		selectedList: 1,
	}).multiselectfilter({
		label: '查找:',
		placeholder: '输入关键字'
	});
	for (var i=0; i < vssline.length; i++){
		var v=vssline[i], opt=$('<option />', {
			value: v[1],
			text: v[0] + '(' + v[2] + "|" + v[3] + ')'
		});
		opt.appendTo(el);
		if(i==0){
			command2=v[1];
			opt.attr('selected',true)
		}
	};
	el.multiselect('refresh');
}

var chart_meminfo2=null;
function meminfo2(a){
	command2=a;
	if(chart_meminfo2 != null){chart_meminfo2.destroy()}
	var data=getmeminfo2(a);
	chart_meminfo2=new Highcharts.Chart({
		chart: {
			renderTo: 'meminfo2',
			type: 'line'
		},
		title: {
			text: '进程VSS和RSS走势图'
		},
		credits: {
			enabled: false
		},
		xAxis: {
			title: {text: 'Uptime(s)'},
			floor: data[0][0][0],
			max: data[0][0][data[0][0].length-1]
		},
		yAxis: {
			labels: {format: '{value}M'},
			title: {text:'memory(M)'}
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			line:{
				turboThreshold:0
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var p1=isHasElement(data[0][0],this.x);
				var arg=data[0][1][p1]
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function (){
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + '</b></td></tr>';
				});
				if(arg!='null'){
					s += '<tr><td style="color: ' + color + '">' + 'ARG:</td>' +'<td style="text-align: left; color: '+ color + '"><b>' + arg +'</td>' + '</b></td></tr>';
				}
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var fpsWindow=0;
function fpsWindows(){
	var el=$("#fps_select").multiselect({
		multiple: false,
		noneSelectedText: "选择窗口",
		minWidth: 350,
		maxWidth: 1000,
		height: 110,
		selectedList: 1,
	}).multiselectfilter({
		label: '查找:',
		placeholder: '输入关键字',
		autoReset: true
	});
	for (var i=0; i < fpslist.length; i++){
		var v=fpslist[i], opt=$('<option />', {
			value: i,
			text: v
		});
		opt.appendTo(el);
		if(i==0){
			opt.attr('selected',true);
		}
	};
	el.multiselect('refresh');
}

var chart_FPS=null;
function FPS(a) {
	fpsWindow=a;
	if(chart_FPS != null){chart_FPS.destroy()}
	var data=getFPS(a)
	chart_FPS=new Highcharts.Chart({
		chart: {
			renderTo: 'FPS',
			type: 'line'
		},
		title: {
			text: 'SurfaceFlinger FPS走势图'
		},
		credits: {
			enabled: false
		},
		xAxis: {
			title: {text: 'uptime(s)'},
			floor: data[0][0],
			max: data[0][1]
		},
		yAxis: [
			{labels: {format: '{value}帧/秒'},title: {text:'FPS'}},
			{labels: {format: '{value}%'},title: {text:'百分比(%)'},opposite: true}
		],
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40
		},
		plotOptions: {
			line:{turboThreshold:0}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function () {
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function () {
					s += '<tr><td style="word-break:keep-all; color: ' + this.series.color + '"><span>' + this.series.name + ':</span></td><td style="text-align: right; color: '+ color + '"><b>' + this.y + '</b></td></tr>';
				});
				var p=isHasElement(data[2][0],this.x);
				if(p>-1){
					s += '<tr><td style="word-break:keep-all; color: ' + color_t + '">MFS(ms):</td><td style="text-align: right; color: '+ color + '"><b>' + data[2][4][p] + '</b></td></tr>' +
						 '<tr><td style="word-break:keep-all; color: ' + color_t + '">OKT:</td><td style="text-align: right; color: '+ color + '"><b>' + data[2][5][p] + '</b></td></tr>' +
						 '<tr><td style="word-break:keep-all; color: ' + color_t + '">Frames:</td><td style="text-align: right; color: '+ color + '"><b>' + data[2][2][p] + '</b></td></tr>' +
						 '<tr><td style="word-break:keep-all; color: ' + color_t + '">jank:</td><td style="text-align: right; color: '+ color + '"><b>' + data[2][3][p] + '</b></td></tr>' +
						 '<tr><td style="word-break:keep-all; color: ' + color_t + '">Date_Time:</td><td style="text-align: right; color: '+ color + '"><b>' + data[2][1][p].replace(' ', '_') + '</b></td></tr></table>';
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var chart_curfreq=null;
function curfreq(){
	if(chart_curfreq != null){chart_curfreq.destroy()}
	var data=getcurfreq();
	chart_curfreq=new Highcharts.Chart({
		chart: {
			renderTo: 'cur_freq',
			type: 'line'
		},
		title: {text: 'CPU主频走势图'},
		credits: {enabled: false},
		xAxis: {
			title: {text: 'Uptime(s)'},
			floor: data[0][0],
			type: 'category',
			categories: data[0]
		},
		yAxis: {
			title: {text:'主频(MHZ)'},
			floor: 0
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			line:{
				turboThreshold:0
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function (){
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + '</b></td></tr>';
				});
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var sensor=0;
function thermallist(){
	var el=$("#thermal_select").multiselect({
		multiple: false,
		noneSelectedText: "选择sensor",
		minWidth: 350,
		maxWidth: 1000,
		height: 110,
		selectedList: 1,
	}).multiselectfilter({
		label: '查找:',
		placeholder: '输入关键字',
		autoReset: true
	});
	for (var i=0; i < thermaldata[1].length; i++){
		var v=thermaldata[1][i], opt=$('<option />', {
			value: i,
			text: v
		});
		opt.appendTo(el);
		if(i==0){
			opt.attr('selected',true);
		}
	};
	el.multiselect('refresh');
}

var chart_thermal=null;
function thermal(a){
	sensor=a;
	if(chart_thermal != null){chart_thermal.destroy()}
	var data=getthermal(a);
	chart_thermal=new Highcharts.Chart({
		chart: {
			renderTo: 'THERMAL',
			type: 'line'
		},
		title: {text: 'Thermal sensor走势图'},
		credits: {enabled: false},
		xAxis: {
			title: {text: 'Uptime(s)'},
			floor: data[0][0],
			type: 'category',
			categories: data[0]
		},
		yAxis: {
			title: {text:'温度°'},
			floor: 0
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			line:{
				turboThreshold:0
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function (){
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + '°</b></td></tr>';
				});
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var chart_gpufreq=null;
function gpufreq(){
	if(chart_gpufreq != null){chart_gpufreq.destroy()}
	var data=getgpufreq();
	chart_gpufreq=new Highcharts.Chart({
		chart: {
			renderTo: 'gpu_freq',
			type: 'line'
		},
		title: {text: 'GPU主频走势图'},
		credits: {enabled: false},
		xAxis: {
			title: {text: 'Uptime(s)'},
			floor: data[0]
		},
		yAxis: {
			title: {text:'主频(MHZ)'},
			floor: 0
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			line:{
				turboThreshold:0
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function (){
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + '</b></td></tr>';
				});
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var chart_FPS2=null;
function FPS2(){
	if(chart_FPS2 != null){chart_FPS2.destroy()}
	var data=getFPS2();
	chart_FPS2=new Highcharts.Chart({
		chart: {
			renderTo: 'FPS2',
			type: 'column',
//			options3d:{
//			    enabled: true,
//			    alpha: 15,
//			    beta: 15,
//			    viewDistance: 45,
//			    depth: 60
//			}
		},
		title: {text: 'GFXInfo FPS 耗时图'},
		credits: {enabled: false},
		xAxis: {
			title: {text: 'Frame(c)'},
			categories: data[0]
		},
		yAxis: {
		    title: {text: 'Time in milliseconds'},
		    min: 0,
		    stackLabels: {
		        enabled: true
		    }
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40,
		},
		plotOptions: {
			column:{
				stacking: 'normal',
				depth: 40,
				dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
//                       textShadow: '0 0 3px black'
                    }
                }
			}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function (){
				var s='<small>' + this.x + 'frame</small><table>';
				$.each(this.points, function (){
					s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
						'<td style="text-align: left; color: '+ color + '"><b>' + this.y + 'ms</b></td></tr>';
				});
				if(csvData[0]==1){
					var p=isHasElement(Windows[0],this.x);
					if(p>=0){
						s += '<tr><td style="color: '+ color + '">Data_Time:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[1][p].replace(' ', '_') + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedWindow:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[2][p] + '</b></td></tr>';
						s += '<tr><td style="color: '+ color + '">FocusedApplication:</td>' + '<td style="text-align: left; color: '+ color + '"><b>' + Windows[3][p] + '</b></td></tr></table>';
					}
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data[1],
		exporting: {enabled: true}
	});
}

var chart_GFX=null;
function GFX(a) {
	if(chart_GFX != null){chart_GFX.destroy()}
	var data=getGFX(a);
//	console.log(data);
	var min = fps_systrace_data[1][0];
	var max = fps_systrace_data[1][1];
	var start_time = fps_systrace_data[1][2];
	var end_time = fps_systrace_data[1][3];
	var max_time = fps_systrace_data[1][8];
	var A = fps_systrace_data[1][11];
	var B = fps_systrace_data[1][12];
	var C = fps_systrace_data[1][13];
	var frames = fps_systrace_data[1][6];
	var waiting_time = fps_systrace_data[1][9];
	var wait_times = fps_systrace_data[1][10];
	chart_GFX=new Highcharts.Chart({
		chart: {
			renderTo: 'GFX',
			type: 'line'
		},
		title: {
			text: 'SYSTRACE FPS走势图'
		},
		credits: {
			enabled: false
		},
		xAxis: {
			title: {text: 'uptime(s)'},
			floor: min,
			max: max
		},
		yAxis: [
			{labels: {format: '{value}帧/秒'},title: {text:'FPS'},min: 0},
			{labels: {format: '{value}%'},title: {text:'百分比(%)'},min: 0,opposite: true}
		],
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			x: 0,
			y: 40
		},
		plotOptions: {
			line:{turboThreshold:0}
		},
		tooltip: {
			shared: true,
			crosshairs: true,
			useHTML: true,
			formatter: function () {
				var s='<small>' + this.x + 's</small><table>';
				$.each(this.points, function () {
					s += '<tr><td style="word-break:keep-all; color: ' + this.series.color + '"><span>' + this.series.name + ':</span></td><td style="text-align: right; color: '+ color + '"><b>' + this.y + '</b></td></tr>';
				});
				var p=isHasElement(start_time,this.x);
				if(p==-1)p=isHasElement(end_time,this.x);
				if(p>-1){
					s += '<tr><td style="word-break:keep-all; color: ' + color + '">最大卡顿:</td><td style="text-align: right; color: '+ color + '"><b>' + max_time[p] + 'ms</b></td></tr>' +
						 '<tr><td style="word-break:keep-all; color: ' + color + '">A：[100,500):</td><td style="text-align: right; color: '+ color + '"><b>' + A[p] + '</b></td></tr>' +
						 '<tr><td style="word-break:keep-all; color: ' + color + '">B：[50,100):</td><td style="text-align: right; color: '+ color + '"><b>' + B[p] + '</b></td></tr>' +
						 '<tr><td style="word-break:keep-all; color: ' + color + '">C：[42,50):</td><td style="text-align: right; color: '+ color + '"><b>' + C[p] + '</b></td></tr>' +
						 '<tr><td style="word-break:keep-all; color: ' + color + '">总帧数:</td><td style="text-align: right; color: '+ color + '"><b>' + frames[p] + '</b></td></tr>' +
						 '<tr><td style="word-break:keep-all; color: ' + color + '">等待次数(≥500ms):</td><td style="text-align: right; color: '+ color + '"><b>' + wait_times[p] + '</b></td></tr>' +
						 '<tr><td style="word-break:keep-all; color: ' + color + '">等待时长:</td><td style="text-align: right; color: '+ color + 's"><b>' + waiting_time[p] + '</b></td></tr></table>';
				}else{
					s += '</table>';
				}
				return s;
			}
		},
		series: data,
		exporting: {enabled: true}
	});
}

function updatecharts(a,SurfaceView){
		if(csvData[9] == 0){
			document.getElementById("cur_freq").style.display="none"
		}else{
			document.getElementById("cur_freq").style.display="";
			curfreq()
		};
		if(csvData[2] == 0){
			document.getElementById("cpu").style.display="none"
		}else{
			document.getElementById("cpu").style.display="";
			cpu()
		};
		if(csvData[3] == 0){
			document.getElementById("cpu_menu").style.display="none";
			document.getElementById("cpuinfo").style.display="none";
			$("#cpuinfolist").empty()
		}else{
			document.getElementById("cpu_menu").style.display="";
			document.getElementById("cpuinfo").style.display=""
			if(a==0){
				$("#cpuinfolist").empty();
				cpuinfolist();
			};
			cpuinfo(cpulist)
		};
		if(csvData[4] == 0){
			document.getElementById("mem_menu").style.display="none";
			document.getElementById("mem").style.display="none"
		}else{
			document.getElementById("mem_menu").style.display="";
			document.getElementById("mem").style.display="";
			mem(mem_map)
		};
		if(csvData[5] == 0){
			document.getElementById("mem2_menu").style.display="none";
			document.getElementById("mem2").style.display="none"
		}else{
			document.getElementById("mem2_menu").style.display="";
			document.getElementById("mem2").style.display="";
			mem2(mem2_map)
		};
		if(csvData[6] == 0){
			document.getElementById("meminfo_menu").style.display="none";
			document.getElementById("meminfo").style.display="none";
			$("#meminfo_select").empty()
		}else{
			document.getElementById("meminfo_menu").style.display="";
			document.getElementById("meminfo").style.display="";
			if(a==0){
				$("#meminfo_select").empty();
				meminfolist();
			};
			meminfo(command);
		};
		if(csvData[7] == 0){
			document.getElementById("meminfo2_menu").style.display="none";
			document.getElementById("meminfo2").style.display="none";
			$("#meminfo2_select").empty()
		}else{
			document.getElementById("meminfo2_menu").style.display="";
			document.getElementById("meminfo2").style.display="";
			if(a==0){
				$("#meminfo2_select").empty();
				meminfo2list()
			};
			meminfo2(command2)
		};
		if(csvData[1] == 0){
			document.getElementById("btm").style.display="none"
		}else{
			document.getElementById("btm").style.display="";
			BTM()
		};
		if(csvData[8] == 0){
			document.getElementById("fps_menu").style.display="none";
			document.getElementById("FPS").style.display="none";
			$("#fps_select").empty()
		}else{
			document.getElementById("fps_menu").style.display="";
			document.getElementById("FPS").style.display="";
			if(a==0){
				$("#fps_select").empty();
				fpsWindows();
			};
			FPS(fpsWindow)
		};
		if(csvData[10] == 0){
			document.getElementById("thermal_menu").style.display="none";
			document.getElementById("THERMAL").style.display="none";
			$("#thermal_select").empty()
		}else{
			document.getElementById("thermal_menu").style.display="";
			document.getElementById("THERMAL").style.display="";
			if(a==0){
				$("#thermal_select").empty();
				thermallist();
			};
			thermal(sensor)
		};
		if(csvData[11] == 0){
			document.getElementById("gpu_freq").style.display="none"
		}else{
			document.getElementById("gpu_freq").style.display="";
			gpufreq()
		};
		if(csvData[12] == 0){
			document.getElementById("FPS2").style.display="none"
		}else{
			document.getElementById("FPS2").style.display="";
			FPS2()
		};
		if(csvData[13] == 0){
			document.getElementById("GFX").style.display="none";
			document.getElementById("GFX_menu").style.display="none";
			document.getElementById("Package_select").style.display="none";
			document.getElementById("Surface_select").style.display="none";
		}else{
			document.getElementById("GFX").style.display="";
//			document.getElementById("GFX_menu").style.display="";
//			document.getElementById("Package_select").style.display="";
//			document.getElementById("Surface_select").style.display="";
			GFX(SurfaceView)
		};
}

function ResetOptions(){
	var defaultOptions = Highcharts.getOptions()
	for (var prop in defaultOptions){
		if (typeof defaultOptions[prop] !== 'function') delete defaultOptions[prop]
	}
}

function ChangeThemes(option){
    Selected_theme=option.value
	var background_img;
	ResetOptions();
	Highcharts.setOptions(themeArr[0]);
	if (option.value == "6"||option.value == "8" ){document.bgColor = '#FFFFFF'}else{document.bgColor = '#DCDCDC'}
	if (option.value == "1"||option.value == "2"||option.value == "3"||option.value == "4"){color='#FFF'}else{color='#333333'}
	if (option.value == "7" ){
		background_img='url(head/sand.png)'
	}else{
		background_img=null
	}
	Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed){
		proceed.call(this);
		this.container.style.background=background_img
	});
	Highcharts.setOptions(themeArr[option.value]);
	updatecharts(1)
}