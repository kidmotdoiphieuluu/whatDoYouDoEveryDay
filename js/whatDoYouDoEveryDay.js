/* 
 * JS of whatDoYouDoEveryDay.html
 */

/* Global variable */
var timeLeft = 1440;
var timeOptional = 1440;
var idCount = 1;

$(document).ready(function() {
	$('#workName').focus();
	
	// CREATE TIMELINE HOURS
	for (var i = 0; i <= 23; i++) {
		$('#timelineSeparate').append('<div class="timelineSp"></div>');
		$('#timelineHours').append('<div class="timelineHour" ><span>' + i + '</span></div>');
	}
	
	// ACTION WHEN SORTED LIST ITEM
	$('.sortable').sortable().bind('sortupdate', function() {
		
		// Update timeline items
		var listWork = $('.workItem');
		var timelineWork = $('#timeline > div');
		$('#freeTime').css('order', timelineWork.length);
		
		for (var i = 0; i < listWork.length; i++) {
			for (var j = 0; j < timelineWork.length; j++) {
				if (timelineWork[j].id.replace('timelineWork', '') === listWork[i].id.replace('listWork', '')) {
					$('#' + timelineWork[j].id).css('order', i);
					break;
				}
			}
		}
	});
	
	// UPDATE TIMELEFT
	function updateTimeLeft(totalMinutes) {
		timeLeft += totalMinutes;
		$('#timeLeft').text('You have ' + ~~(timeLeft / 60) + ' hour(s) ' + (timeLeft % 60) + ' minute(s) left!');
		if ($('#freeTime')) $('#freeTime').remove();
		if (timeLeft !== 0) $('#timeline').append('<div id="freeTime" class="optional" title="Free time" style="flex: ' + timeLeft + ' 1 0; order: ' + $('#timeline > div').length + '"><span>Free time</span></div>');
	}
	
	// ACTION WHEN CLICK EDIT
	function editItem() {
		var eleParent = this.parentElement;
		var idList = '#' + eleParent.id;
		var idTimeline = idList.replace('listWork', 'timelineWork');
		
		if (this.textContent === 'Edit') {
			$(idList + ' .del').prop('disabled', true);
			$(idList + ' .workName').prop('disabled', false);
			$(idList + ' .hour').prop('disabled', false);
			$(idList + ' .min').prop('disabled', false);
			$(idList + ' .workLevel').prop('disabled', false);
			this.textContent = 'OK';
			
		} else {
			$(idList + ' .del').prop('disabled', false);
			$(idList + ' .workName').prop('disabled', true);
			$(idList + ' .hour').prop('disabled', true);
			$(idList + ' .min').prop('disabled', true);
			$(idList + ' .workLevel').prop('disabled', true);
			this.textContent = 'Edit';
			
			var oldMin = Number($(idTimeline).css('flex-grow'));
			var newMin = Number($(idList + ' .hour').val()) * 60 + Number($(idList + ' .min').val());
			updateTimeLeft(oldMin - newMin);
			
			$(idTimeline).attr({
				'class': $(idList + ' .workLevel').val(),
				'title': $(idList + ' .workName').val()
			});
			$(idTimeline).css('flex-grow', newMin);
			$(idTimeline + ' > span').text($(idList + ' .workName').val());
		}
		
	}
	
	// ACTION WHEN CLICK DEL
	function delItem() {
		var eleParent = this.parentElement;
		var id = eleParent.id.replace('listWork', '');
		var totalMinutes = Number($('#listWork' + id + ' .hour').val()) * 60 + Number($('#listWork' + id + ' .min').val());
		
		// Update time optional
		if ($(eleParent.id + ' .workLevel').val() === 'optional') {
			timeOptional += totalMinutes;
			$('#timeOptional').text('You have total ' + ~~(timeOptional / 60) + ' hour(s) ' + (timeOptional % 60) + ' minute(s) time optional.');
		}
		
		$('#timelineWork' + id).remove();
		$(eleParent).remove();
		$('#freeTime').remove();
		
		updateTimeLeft(totalMinutes);
		
	}
	
	// ACTION WHEN CLICK SUBMIT
	$('#submit').on('click', function createNewItem() {
		if ('content' in document.createElement('template')) {
			var totalMinutes;
			
			// Check before submit
			if ($('#workName').val() === "") {
				$('#msg').text('Work name can not be blank!');
				$('#workName').focus();
				return;
				
			} else if ($('#hour').val() === "") {
				$('#msg').text('Hour can not be blank!');
				$('#hour').focus();
				return;
				
			} else if ($('#hour').val() < 0 || $('#hour').val() > 24) {
				$('#msg').text('Hour must be in range of 0 to 24!');
				$('#hour').focus();
				return;
				
			} else if ($('#min').val() == "") {
				$('#msg').text('Minute can not be blank!');
				$('#min').focus();
				return;
				
			} else if ($('#min').val() < 0 || $('#min').val() > 59) {
				$('#msg').text('Hour must be in range of 0 to 59!');
				$('#min').focus();
				return;
				
			} else if ((totalMinutes = (Number($('#hour').val()) * 60 + Number($('#min').val()))) > timeLeft) {
				$('#msg').text('Total hours and minutes can not large than ' + ~~(timeLeft / 60) + ' hour(s) ' + (timeLeft % 60) + ' minute(s)!');
				$('#hour').focus();
				return;
				
			} else if (totalMinutes === 0) {
				$('#msg').text('Total hours and minutes must be large than 0 minute!');
				$('#hour').focus();
				return;
				
			} else {
				$('#msg').text('');
				
			}
			
			// Get all element of new work item
			var newItem = document.importNode(document.querySelector('#workItem').content, true);
			var newItemName = newItem.querySelector('.workName');
			var newItemHour = newItem.querySelector('.hour');
			var newItemMin = newItem.querySelector('.min');
			var newItemLevel = newItem.querySelector('.workLevel');
			var newItemLevelOption = newItemLevel.querySelectorAll('option');
			
			// Set value base on user input
			$(newItem.querySelector('.workItem')).attr({
				'id': 'listWork' + idCount,
				'class': 'workItem ' + $('#workLevel').val().toLowerCase()
			});
			$(newItemName).attr({
				value: $('#workName').val(),
				title: $('#workName').val(),
				disabled: 'disabled'
			});
			$(newItemHour).attr({
				value: $('#hour').val(),
				disabled: 'disabled'
			});
			$(newItemMin).attr({
				value: $('#min').val(),
				disabled: 'disabled'
			});
			$(newItemLevel).attr('disabled', 'disabled');
			for (var i = 0; i < newItemLevelOption.length; i++) {
				if (newItemLevelOption[i].value === $('#workLevel').val().toLowerCase()) {
					newItemLevelOption[i].setAttribute('selected', 'selected');
					break;
				}
			}
			
			// Append new work to list
			$('#listWork > ul').append(newItem);
			$('#listWork' + idCount + ' .edit').on('click', editItem);
			$('#listWork' + idCount + ' .del').on('click', delItem);
			
			$('.sortable').sortable({
				items: '.workItem',
				handle: '.sortHandler'
			});
			
			// Create timelineItem
			$('#freeTime').remove();
			var timelineItem = '<div id="timelineWork' + idCount++ + '" class="' + $('#workLevel').val() + '" title="' + $('#workName').val() + '" style="flex: ' + totalMinutes + ' 1 0">\
									<span>' + $('#workName').val() + '</span>\
								</div>';
			$('#timeline').append(timelineItem);
			
			// Remove time from timeLeft
			updateTimeLeft(-(totalMinutes));
			
			// Update time optional
			if ($('#workLevel').val() !== 'optional') {
				timeOptional -= totalMinutes;
				$('#timeOptional').text('You have total ' + ~~(timeOptional / 60) + ' hour(s) ' + (timeOptional % 60) + ' minute(s) time optional.');
			}
			
			// Reset input form
			$('#workName').focus();
			$('#workName').val('');
			$('#hour').val('');
			$('#min').val('');
			$('#workLevel').val('important');
		}
	});
	
	// UPDATE LOCALSTORAGE
	function updateLocalStorage() {
		
	}
	
	// EXPORT TO STRING
	function exportToString() {
		var eStr = '';
		var listWorkItem = document.querySelectorAll('.workItem');
		var id;
		
		for (var i = 0; i < listWorkItem.length; i++) {
			id = '#' + listWorkItem[i].id;
			eStr += ((i === 0)?(''):('\n---\n')) + $(id + ' .workName').val() + '\n' + $(id + ' .hour').val() + '\n' + $(id + ' .min').val() + '\n' + $(id + ' .workLevel').val();
		}
		eStr += '\n---\n' + timeLeft;
		
		$('#exportImport').text(eStr);
	}
	$('#btnExport').on('click', exportToString);
	
	// IMPORT FROM STRING
	function importFromString() {
		var iStr = $('#exportImport').val();
		var listImport = iStr.split('\n---\n');
		var workItem;
		
		for (var i = 0; i < listImport.length - 1; i++) {
			workItem = listImport[i].split('\n');
			
			$('#workName').val(workItem[0]);
			$('#hour').val(workItem[1]);
			$('#min').val(workItem[2]);
			$('#workLevel').val(workItem[3]);
			
			$('#submit').click();
		}
		
		$('#exportImport').val('');
	}
	$('#btnImport').on('click', importFromString);
	
});