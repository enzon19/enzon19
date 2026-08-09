// PROFILE-BUTTONS
document
	.querySelector('#profile-buttons')
	.addEventListener('mouseover', (event) => {
		const { target } = event;

		if (
			(target.tagName == 'a' || target.closest('a')) &&
			faceVariant != 'bigSmile' &&
			faceVariant != 'dizzy'
		) {
			faceVariant = 'bigSmile';
		}
	});

document
	.querySelector('#profile-buttons')
	.addEventListener('mouseleave', (event) => {
		if (faceVariant != 'dizzy') faceVariant = 'default';
	});
