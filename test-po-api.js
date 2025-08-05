// Test script sederhana untuk API PO Sessions
// Jalankan dengan: node test-po-api.js

const BASE_URL = 'http://localhost:3000';

async function testPOSessionAPI() {
  console.log('🧪 Testing PO Session API...\n');

  try {
    // Test 1: GET all PO sessions (should return empty array initially)
    console.log('1. Testing GET /api/po-sessions');
    const getResponse = await fetch(`${BASE_URL}/api/po-sessions`);
    const sessions = await getResponse.json();
    console.log('✅ GET sessions:', sessions);
    console.log('');

    // Test 2: GET active PO sessions
    console.log('2. Testing GET /api/po-sessions/active');
    const activeResponse = await fetch(`${BASE_URL}/api/po-sessions/active`);
    const activeSessions = await activeResponse.json();
    console.log('✅ GET active sessions:', activeSessions);
    console.log('');

    // Test 3: GET all products (untuk mendapatkan productIds)
    console.log('3. Testing GET /api/products');
    const productsResponse = await fetch(`${BASE_URL}/api/products`);
    const products = await productsResponse.json();
    console.log('✅ GET products count:', products.length);
    
    if (products.length === 0) {
      console.log('❌ No products found. Please add some products first!');
      return;
    }

    // Test 4: POST create new PO session
    const testPOSession = {
      name: 'Test PO Kue Lebaran',
      description: 'Testing PO session untuk kue lebaran',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      status: 'DRAFT',
      productIds: products.slice(0, 2).map(p => p.id) // Take first 2 products
    };

    console.log('4. Testing POST /api/po-sessions');
    const createResponse = await fetch(`${BASE_URL}/api/po-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPOSession),
    });

    if (createResponse.ok) {
      const newSession = await createResponse.json();
      console.log('✅ POST create session:', newSession.name);
      
      // Test 5: GET single PO session
      console.log('5. Testing GET /api/po-sessions/[id]');
      const singleResponse = await fetch(`${BASE_URL}/api/po-sessions/${newSession.id}`);
      const singleSession = await singleResponse.json();
      console.log('✅ GET single session:', singleSession.name);
      
    } else {
      const error = await createResponse.json();
      console.log('❌ POST failed:', error);
    }

    console.log('\n🎉 API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPOSession API(); 