rm:
	docker-compose rm -f
	docker-compose pull

up:
	docker-compose up --build -d

down:
	docker-compose down

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d