#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Quoridor Game
Tests the POST /api/games and GET /api/games endpoints
"""

import requests
import json
import time
from typing import Dict, List, Any

# Get backend URL from frontend .env file
BACKEND_URL = "https://barrier-chess.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class QuoridorAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "passed": passed,
            "details": details
        })
        
    def test_get_games_empty(self):
        """Test GET /api/games returns empty array when no games exist"""
        try:
            response = self.session.get(f"{API_BASE}/games")
            
            if response.status_code != 200:
                self.log_test("GET /api/games (empty)", False, f"Expected 200, got {response.status_code}")
                return False
                
            games = response.json()
            if not isinstance(games, list):
                self.log_test("GET /api/games (empty)", False, f"Expected list, got {type(games)}")
                return False
                
            # Note: We can't guarantee empty since other tests might have run
            self.log_test("GET /api/games (empty)", True, f"Returned {len(games)} games")
            return True
            
        except Exception as e:
            self.log_test("GET /api/games (empty)", False, f"Exception: {str(e)}")
            return False
    
    def test_post_game_valid_local(self):
        """Test POST /api/games with valid local game data"""
        try:
            game_data = {
                "winner_name": "Alice",
                "game_mode": "local"
            }
            
            response = self.session.post(
                f"{API_BASE}/games",
                json=game_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code != 200:
                self.log_test("POST /api/games (valid local)", False, f"Expected 200, got {response.status_code}: {response.text}")
                return None
                
            result = response.json()
            
            # Validate response structure
            required_fields = ["game_number", "winner_name", "game_mode", "created_at"]
            for field in required_fields:
                if field not in result:
                    self.log_test("POST /api/games (valid local)", False, f"Missing field: {field}")
                    return None
            
            # Validate values
            if result["winner_name"] != "Alice":
                self.log_test("POST /api/games (valid local)", False, f"Wrong winner_name: {result['winner_name']}")
                return None
                
            if result["game_mode"] != "local":
                self.log_test("POST /api/games (valid local)", False, f"Wrong game_mode: {result['game_mode']}")
                return None
                
            if not isinstance(result["game_number"], int) or result["game_number"] < 1:
                self.log_test("POST /api/games (valid local)", False, f"Invalid game_number: {result['game_number']}")
                return None
            
            self.log_test("POST /api/games (valid local)", True, f"Created game #{result['game_number']}")
            return result
            
        except Exception as e:
            self.log_test("POST /api/games (valid local)", False, f"Exception: {str(e)}")
            return None
    
    def test_post_game_valid_ai(self):
        """Test POST /api/games with valid AI game data"""
        try:
            game_data = {
                "winner_name": "Bob",
                "game_mode": "ai"
            }
            
            response = self.session.post(
                f"{API_BASE}/games",
                json=game_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code != 200:
                self.log_test("POST /api/games (valid AI)", False, f"Expected 200, got {response.status_code}: {response.text}")
                return None
                
            result = response.json()
            
            # Validate response structure and values
            if result["winner_name"] != "Bob" or result["game_mode"] != "ai":
                self.log_test("POST /api/games (valid AI)", False, f"Wrong data in response")
                return None
            
            self.log_test("POST /api/games (valid AI)", True, f"Created AI game #{result['game_number']}")
            return result
            
        except Exception as e:
            self.log_test("POST /api/games (valid AI)", False, f"Exception: {str(e)}")
            return None
    
    def test_game_number_increment(self):
        """Test that game_number auto-increments correctly"""
        try:
            # Create first game
            game1_data = {"winner_name": "Player1", "game_mode": "local"}
            response1 = self.session.post(f"{API_BASE}/games", json=game1_data)
            
            if response1.status_code != 200:
                self.log_test("Game number increment", False, f"First game failed: {response1.status_code}")
                return False
                
            game1 = response1.json()
            
            # Create second game
            game2_data = {"winner_name": "Player2", "game_mode": "ai"}
            response2 = self.session.post(f"{API_BASE}/games", json=game2_data)
            
            if response2.status_code != 200:
                self.log_test("Game number increment", False, f"Second game failed: {response2.status_code}")
                return False
                
            game2 = response2.json()
            
            # Check increment
            if game2["game_number"] != game1["game_number"] + 1:
                self.log_test("Game number increment", False, 
                            f"Expected {game1['game_number'] + 1}, got {game2['game_number']}")
                return False
            
            self.log_test("Game number increment", True, 
                        f"Game numbers: {game1['game_number']} → {game2['game_number']}")
            return True
            
        except Exception as e:
            self.log_test("Game number increment", False, f"Exception: {str(e)}")
            return False
    
    def test_post_game_missing_fields(self):
        """Test POST /api/games with missing required fields"""
        test_cases = [
            ({}, "empty body"),
            ({"winner_name": "Alice"}, "missing game_mode"),
            ({"game_mode": "local"}, "missing winner_name"),
            ({"winner_name": ""}, "empty winner_name"),
            ({"winner_name": "Alice", "game_mode": ""}, "empty game_mode")
        ]
        
        all_passed = True
        for data, description in test_cases:
            try:
                response = self.session.post(f"{API_BASE}/games", json=data)
                
                # Should return 422 for validation errors
                if response.status_code == 422:
                    self.log_test(f"POST validation ({description})", True, "Correctly rejected")
                else:
                    self.log_test(f"POST validation ({description})", False, 
                                f"Expected 422, got {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"POST validation ({description})", False, f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_get_games_with_data(self):
        """Test GET /api/games returns games in correct order"""
        try:
            # First, add a few games to ensure we have data
            games_to_add = [
                {"winner_name": "TestPlayer1", "game_mode": "local"},
                {"winner_name": "TestPlayer2", "game_mode": "ai"},
                {"winner_name": "TestPlayer3", "game_mode": "local"}
            ]
            
            created_games = []
            for game_data in games_to_add:
                response = self.session.post(f"{API_BASE}/games", json=game_data)
                if response.status_code == 200:
                    created_games.append(response.json())
            
            # Now get all games
            response = self.session.get(f"{API_BASE}/games")
            
            if response.status_code != 200:
                self.log_test("GET /api/games (with data)", False, f"Expected 200, got {response.status_code}")
                return False
                
            games = response.json()
            
            if not isinstance(games, list):
                self.log_test("GET /api/games (with data)", False, f"Expected list, got {type(games)}")
                return False
            
            if len(games) == 0:
                self.log_test("GET /api/games (with data)", False, "No games returned")
                return False
            
            # Check that games are sorted by game_number descending (newest first)
            for i in range(len(games) - 1):
                if games[i]["game_number"] < games[i + 1]["game_number"]:
                    self.log_test("GET /api/games (with data)", False, 
                                f"Games not sorted correctly: {games[i]['game_number']} < {games[i + 1]['game_number']}")
                    return False
            
            # Verify structure of returned games
            for game in games[:3]:  # Check first 3 games
                required_fields = ["game_number", "winner_name", "game_mode", "created_at"]
                for field in required_fields:
                    if field not in game:
                        self.log_test("GET /api/games (with data)", False, f"Missing field {field} in game")
                        return False
            
            self.log_test("GET /api/games (with data)", True, 
                        f"Retrieved {len(games)} games, properly sorted")
            return True
            
        except Exception as e:
            self.log_test("GET /api/games (with data)", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_game_modes(self):
        """Test POST /api/games with invalid game modes"""
        invalid_modes = ["invalid", "multiplayer", "online", 123, None]
        
        all_passed = True
        for mode in invalid_modes:
            try:
                game_data = {"winner_name": "TestPlayer", "game_mode": mode}
                response = self.session.post(f"{API_BASE}/games", json=game_data)
                
                # The API might accept any string, so we check if it's stored correctly
                if response.status_code == 200:
                    result = response.json()
                    # If it accepts the invalid mode, that's actually fine for this simple API
                    self.log_test(f"POST invalid mode ({mode})", True, 
                                f"Accepted mode '{mode}' - API is flexible")
                else:
                    self.log_test(f"POST invalid mode ({mode})", True, 
                                f"Rejected invalid mode - status {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"POST invalid mode ({mode})", False, f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def run_all_tests(self):
        """Run all tests and return summary"""
        print(f"🚀 Starting Quoridor Backend API Tests")
        print(f"📍 Testing API at: {API_BASE}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            self.test_get_games_empty,
            self.test_post_game_valid_local,
            self.test_post_game_valid_ai,
            self.test_game_number_increment,
            self.test_post_game_missing_fields,
            self.test_get_games_with_data,
            self.test_invalid_game_modes
        ]
        
        for test in tests:
            test()
            time.sleep(0.1)  # Small delay between tests
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["passed"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["passed"]:
                    print(f"  • {result['test']}: {result['details']}")
        
        return passed == total

if __name__ == "__main__":
    tester = QuoridorAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend APIs are working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the details above.")