const styles = {
    success: 'background: #28a745; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    starting: 'background: #8640ff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    error: 'background: #dc3545; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    info: 'background: #007bff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
};
const logPrefix = '%c[CedexTap Bot] ';

const originalLog = console.log;
console.log = function () {
    if (typeof arguments[0] === 'string' && arguments[0].includes('[CedexTap Bot]')) {
        originalLog.apply(console, arguments);
    }
};

console.error = console.warn = console.info = console.debug = () => { };

console.clear();
console.log(`${logPrefix}Starting`, styles.starting);
console.log(`${logPrefix}Create by t.me/kenvnit - Phạm Quang Vũ`, styles.starting);

function createEvent(type, target, options) {
    const event = new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1,
        pointerId: 1,
        width: 1,
        height: 1,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        pointerType: 'touch',
        isPrimary: true,
        //...options
    });
    target.dispatchEvent(event);
}

function getCoords(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    return {
        clientX: x,
        clientY: y,
        screenX: window.screenX + x,
        screenY: window.screenY + y
    };
}

const randomDelay = (min, max) => Math.random() * (max - min) + min;
const randomOffset = range => Math.random() * range * 2 - range;
const randomPressure = () => Math.random() * 0.5 + 0.5;

function clickElement(target) {
    const { clientX, clientY, screenX, screenY } = getCoords(target);
    const options = {
        clientX: clientX + randomOffset(5),
        clientY: clientY + randomOffset(5),
        screenX: screenX + randomOffset(5),
        screenY: screenY + randomOffset(5),
        pressure: randomPressure()
    };
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type => createEvent(type, target, options));
}


let isGamePaused = false;

function toggleGamePause() {
    isGamePaused = !isGamePaused;
    pauseButton.textContent = isGamePaused ? 'Resume' : 'Pause';
}

const pauseButton = document.createElement('button');
pauseButton.textContent = 'Pause';
Object.assign(pauseButton.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    padding: '4px 8px',
    backgroundColor: '#5d5abd',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
});
pauseButton.onclick = toggleGamePause;
document.body.appendChild(pauseButton);

let totalPoints = 0;
let tapOptionIndex = -1;
let isCheckFarmClaim = 1;

function autoClick() {
    if (!isGamePaused) {
        try {
			if(isCheckFarmClaim === 0)
			{
				//Begin Click button TAP from Navigation
				const navButtonTap = document.querySelector('.Navigation_nav__MsE7Z .Button_btn__XqmXE:nth-child(1)');
				if(navButtonTap)
				{
					clickElement(navButtonTap);
				}
				//End Click button TAP from Navigation
			}
			//Begin Claim Result Tap
			const claimContainerForClaim = document.querySelector('.Tap_claimContainerForClaim__wEVt3');
			if(claimContainerForClaim)
			{
				console.log(`${logPrefix}Claim`, styles.info);
				const claim = document.querySelector('.Tap_claimButton__iCJVm');
				const gameResult = document.querySelector('.Tap_claimContainerForClaim__wEVt3 > .Tap_balance__mpEf6').innerText;
				const points = parseInt(gameResult.replace(/[^0-9]/g, ''), 10);
				totalPoints += points;
				console.log(`${logPrefix}Stats: Points: ${points} | Total Points: ${totalPoints}`, styles.success);
				clickElement(claim);
				setTimeout(autoClick, randomDelay(1000, 3000));
				return;
			}
			//End Claim Result Tap
			//Begin Join Battle
			const joinContainerSmall = document.querySelector('.Tap_joinContainerSmall__kktxM');
			const joinTheBattle = document.querySelector('.Tap_claimButton__iCJVm');
			if(joinContainerSmall && joinTheBattle)
			{
				console.log(`${logPrefix}JoinBattle`, styles.info);
				tapOptionIndex = -1;
				isCheckFarmClaim = 1;
				
				clickElement(joinTheBattle);
				setTimeout(autoClick, randomDelay(100, 250));
				return;
			}
			//End Join Battle
			//Begin Tap Tap Tap
			const tapBtns = document.querySelectorAll('.Tap_tapBtn__3IPK2');
			const claimContainer = document.querySelector('.Tap_claimContainer__mbHyw');
			if(tapBtns.length && !claimContainer)
			{
				console.log(`${logPrefix}TapTap ${tapOptionIndex}`, styles.info);
				if(tapOptionIndex === -1) tapOptionIndex = Math.floor(Math.random() * tapBtns.length);
				clickElement(tapBtns[tapOptionIndex]);
				setTimeout(autoClick, randomDelay(100, 250));
				return;
			}
			//End Tap Tap Tap
			//Begin Check Farm
			const btnFarmClaim = document.querySelector('.Farm_startFarmingBtnWrapper__iEYr7 > .Button_btn__XqmXE'); 
			console.log(`${logPrefix}${btnFarmClaim}`, styles.info);
			if(btnFarmClaim)
			{
				clickElement(btnFarmClaim);
				isCheckFarmClaim = 0;
				setTimeout(autoClick, randomDelay(50, 150));
				return;
			}
			if(isCheckFarmClaim === 1)
			{
				const navButtonFarm = document.querySelector('.Navigation_nav__MsE7Z .Button_btn__XqmXE:nth-child(3)');
				console.log(`${logPrefix}${navButtonFarm}`, styles.info);
				clickElement(navButtonFarm);
				setTimeout(autoClick, randomDelay(50, 150));
				return;
			}
			//End Check Farm
			setTimeout(autoClick, randomDelay(50, 150));
			return;
			
        } catch (error) {
    		// Do not log the error to avoid cluttering the console
		console.log(`${logPrefix}${error.message}`, styles.error);
        }
    }
	else
	{
		setTimeout(autoClick, randomDelay(50, 150));
	}
}

autoClick();
