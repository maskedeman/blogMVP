env:
	python3 -m venv myenv
env_activate:
	source myenv/bin/activate
run_server:
	cd server && python3 main.py
	

run_client:
	cd client && npm install && npm run dev
	