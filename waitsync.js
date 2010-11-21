/**
 * WaitSync class provides synchronization between group of
 * two or more functions which you plan to call asyncronously.
 * @param Function callback The callback function to be executed after 
 *        the group of functions is executed
 * 
 * @example
 * 
 *  var chef = new WaitSync(
 * 		function () {
 * 			alert('Cook noodles');
 *  	}
 *  );
 * 
 *	// son will finish chopping in like 4 seconds
 *  setTimeout(
 * 		chef.wait(function () {
 * 
 * 			// when meat is done
 * 			alert('Meat is ready');
 * 		}),
 * 		
 *  	Math.floor(Math.random()*4000)		
 *  );
 * 
 *  // daughter will finish cutting soon 
 *  setTimeout(
 * 		chef.wait(function () {
 * 
 * 			// prepare vegetables
 * 
 * 			alert('Vegetables are ready');
 * 		}),
 * 		Math.floor(Math.random()*4000)
 *  );
 * 
 *  var soupWithNoodles = false;
 *  if (soupWithNoodles) {
 * 		setTimeout(
 * 			chef.wait(function () {
 * 				alert('Noodles are ready');
 * 			}),
 * 			1000
 * 		);
 *  }
 */
function WaitSync(callback) {
	
	
	var completeCount = 0;
	var flags = {};
	
	/**
	 * Wrap task with callback
	 * @param Function task 
	 * @return Function
	 */
	this.wrap = function (task) {
		// add count
		completeCount ++;
		
		return function () {
			// proxy, buffer
			var tmp = task.apply(this, arguments);
			
			// is it time to call back? :)
			completeCount--;
			
			if (completeCount === 0)
				callback();
				
			return tmp;
		}
		
	};
	
	/**
	 * Wrap task with potential callback and assign it a certain group.
	 * Several tasks may be grouped.
	 * When task is called, it's whole group is considered to be done.
	 * It's like... wait for one of the group to be complete.
	 * @param Number/String groupName a name of the group
	 * @param Function task 
	 * @return Function
	 */
	this.wrapGroup = function (groupName, task) {
		
		// if not created earlier
		if (flags[groupName] !== false) {
			// set task group uncomplete 
			flags[groupName] = false;
			completeCount ++;
		}
		
		return function () {
			var tmp = task.apply(this, arguments);
			
			// only if group is not done
			if (!flags[groupName]) {
				completeCount--;
				flags[groupName] = true;
			
				if (completeCount === 0)
					callback();
			}
			
			return tmp;
		}
	};
}
