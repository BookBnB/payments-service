Feature: Hello World

	Scenario: Hello World
		Given the application is running
		When I access '/'
		Then I get a response 'Hello World!'