import React, {  } from 'react';
import './Pages.css';
import NavMenu from '../components/navBar';
import 'bootstrap/dist/css/bootstrap.css';

class FriendPage extends React.Component<{}, any> {
    render(): React.ReactNode {
		return (
			<div key={"friendPage"}>
			<NavMenu/>
				<div className='text-center'>
					<div>
						<h1>Barátok:</h1>
                        <ul>
                            <li>USername: 1000pont</li>
                            <li>USername: 1000pont</li>
                            <li>USername: 1000pont</li>
                            <li>USername: 1000pont</li>
                            <li>USername: 1000pont</li>
                            <li>USername: 1000pont</li>
                            <li>USername: 1000pont</li>
                            <li>USername: 1000pont</li>
                            <li>USername: 1000pont</li>
                            <li>USername: 1000pont</li>
                        </ul>
					</div>
				</div>
			</div>
		);
    }
}
export default FriendPage;