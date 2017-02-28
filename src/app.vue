<style type="text/css" scoped>

 
			.calendar{
				width:350px;
				margin:0 auto 20px;
				color:#333;
			}
			.calendar table{
				width:100%;
				table-layout:fixed;
				border-collapse: collapse;
				border-spacing: 0;
				text-align: center;
			}
			.calendar caption{
				line-height: 30px;
				text-align: center;
				border-bottom: 1px solid #ebebeb;
    			margin-bottom: 5px;
			}
			.calendar caption span{
				margin: 0 10px;
			}
			.calendar caption a{
				color:#666;
				margin:0 5px;
				text-decoration: none;
			}
			.calendar td,.calendar th{
				height: 30px;
				line-height: 30px;
				text-align: center;
			}
			.calendar td span{
				display: block;
			    width: 30px;
			    margin: 0 auto;
			    cursor: pointer;
			}
			.calendar .widget-back{
				float: right;
			}
			.calendar .widget-today span{
				font-weight: bold;
				color:#7fbcda;
			}
			.calendar .widget-disabled span{
				color:#999;
			}
			.calendar .widget-highlight span{
				background: #f7b82e;
				color:#fff;
				border-radius: 30px;
			}
			.calendar .widget-active span{
				background: #39c;
				color:#fff;
				border-radius: 30px;
			}
</style>

<template>
	<div>
		<div class="main" style="margin-top:50px">
			<div class="calendar">
				<table>
				<caption>
				 	<a class="widget-prevYear"  @click="preYear" href="javascript:;">&lt;&lt;</a>
				 	<a class="widget-prevMonth" @click="preMonth" href="javascript:;">&lt;</a>
				 	<span>{{year}}年{{month}}月</span>
				 	<a class="widget-nextMonth" @click="nextMonth" href="javascript:;">&gt;</a><a class="widget-nextYear"  @click="nextYear" href="javascript:;">&gt;&gt;</a><a class="widget-back" @click="today" href="javascript:;">今天</a></caption>
					<thead>
						<tr>
							<th>日</th>
							<th>一</th>
							<th>二</th>
							<th>三</th>
							<th>四</th>
							<th>五</th>
							<th>六</th>
						</tr>
					</thead>
					<tbody>
						 <tr v-for="(row, list) in dayList">
							<td v-for="dayObj in list" @click="selected(dayObj, row, $index)"v-bind:class="{'widget-disabled': dayObj.disabled, 'widget-today': dayObj.today, 'widget-active': dayObj.active}">
						 		<span>{{dayObj.date}}</span>
						 	</td>
						 </tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	let _Date = (y, m, d) => {
		if (!y && !m && !d) 
			return new Date()
		return new Date(y, m-1, d);
	};

	let today = {
			y: new _Date().getFullYear(),
			m: new _Date().getMonth()+1,
			d: new _Date().getDate()
		}; 

	export default {
		props:{
			limitRange: false
		},
		data(){
			return {
				year : today.y,
				month: today.m,
				date : today.d,
				dayList: [],
				//limitRange:["20160521", "20170813"]
			}
		},
		ready(){
			log(this.limitRange)
	       this.getDayList();
		},
		watch:{
			year(){
				this.dayList = [];
				this.getDayList(new _Date(this.year, this.month, this.date));
			},
			month(){
				this.dayList = [];
				this.getDayList(new _Date(this.year, this.month, this.date));
			}
		},
		methods: {
			/** 得到某一天的基本属性day对象
		     * @param {String|Number} year      年  
		     * @param {String|Number} month     月  
		     * @param {String|Number} date      日  
		     * @param {String|Number} week      星期  
		     * @param {String|Number} firstDayW 当前月第一天的星期   
		     * @param {String|Number} lastDayW  当前月最后一天的星期  
		     * @param {String|Number} days      当前月的天数  
		     * @return {Object}
			 */
			getDayInfo(d = new _Date()){
				var [y, m, d, w] = [d.getFullYear(), d.getMonth()+1, d.getDate(), d.getDay()];
				return {
					year : y,
					month: m,
					date : d,
					week : w,
					text : ""+y+(m>10?m:"0"+m)+(d>10?d:"0"+d),
					firstDayW : new _Date(y, m, 1).getDay(),
					lastDayW  : new _Date(y, m+1, 0).getDay(),
					days      : new _Date(y, m+1, 0).getDate()
				}
			},	
			getDayList(date){
				var me        = this,
			  	    activeDay = me.getDayInfo(date),      //获得选中日期的信息
				    year      = activeDay.year,              
				    month     = activeDay.month,
				    firstDayW = activeDay.firstDayW, 
				    lastDayW  = activeDay.lastDayW,
				    days      = activeDay.days,
				    list      = [], addRow;
				//上一月的days				
				for (let i = 0; i < firstDayW; i++) {
					let dayObj = me.getDayInfo(new _Date(year, month, -i));
					list.unshift(dayObj);  
				}                             
				//这个月的days
				for (let i = 0; i < days; i++) {
					let dayObj = me.getDayInfo(new _Date(year, month, i+1));
					list.push(dayObj); 
				}
				addRow = 7-Math.ceil(list.length/7);                //下个月占用行数
				//下一个月的days
				for (let i = 0; i < 7*addRow-lastDayW-1; i++) {
					let dayObj = me.getDayInfo(new _Date(year, month+1, i+1));
					list.push(dayObj);
				}

				//给day添加样式   
				list.forEach(function(dayObj){
					if (me.isToday(dayObj)) dayObj.today = true 
					else 
					if(me.limitRange && me.isLimitRange(dayObj)) {
						dayObj.disabled = false;
					} else dayObj.disabled = true
				});
				//把list分成六份,一份为7个，即6行7列便于循环
				for (let i = 0; i < Math.ceil(list.length/7); i++) {  //7个为一行
					this.dayList.push( list.slice(i*7, (i+1)*7) );
				}

			},
			/**  是否在limit范围内
 			 *@param {Object} day对象  
			 *@return {Boolean}
			 */
			isLimitRange(dayObj){
				var range = this.limitRange;  if(!range) return;
				var text = dayObj.text;
				if (text - range[0] >= 0 && text - range[1] <= 0){
					return true;
				}
			},
			/**  是否是"今天"
			 *@param {Object} day对象  
			 *@return {Boolean}
			 */
			isToday(dayObj){
				var [year, month, date] = [dayObj.year, dayObj.month, dayObj.date];
				if (year == today.y && month == today.m && date == today.d){
					return true;
				} else {
					return false;
				}
			},
			selected(dayObj, row, col){
				
			},
			//今天
			today(){
				this.year  = today.y;
				this.month = today.m;
			},
			//上一月
			preMonth(){
				if (this.month == 1) {
					this.year--;
					this.month = 12;
				} else {
					this.month--;
				}
				
			},
			//下一月
			nextMonth(){
				if (this.month == 12) {
					this.year++;
					this.month = 1;
				} else {
					this.month++;
				}
			},
			//上一年
			preYear() {
				this.year--;
			},
			//下一年
			nextYear() {
				this.year++;
			}
		}
	}

</script>