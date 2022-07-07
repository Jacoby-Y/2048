import { publish } from 'gh-pages';

publish(
  'dist',
	{
		branch: 'gh-pages',
		repo: 'https://github.com/Jacoby-Y/2048.git',
		user: {
			name: 'Jacoby-Y',
			email: 'cobyyliniemi@gmail.com'
		}
	},
	() => {
		console.log('Deploy Complete!')
	}
)