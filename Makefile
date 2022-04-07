reset:
	docker-compose rm -f
	docker-compose pull
	docker-compose up --build -d

up:
	docker-compose up --build -d

down:
	docker-compose down

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d