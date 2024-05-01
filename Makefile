env:
	python3 -m venv myenv
env_activate:
	source myenv/bin/activate && pip install -r requirements.txt
run_server:
	cd server && python3 main.py
	
add_requirements:
	pip3 freeze > requirements.txt
run_client:
	cd client && npm install && npm run dev
	