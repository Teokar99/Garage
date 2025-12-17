import { supabase } from '../lib/supabase';
import {
  generateMockCustomers,
  generateVehicle,
  generateService,
  carMakes,
  carModels,
  serviceDescriptions
} from './mockData';

function generateLicensePlate(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const plate =
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)] +
    '-' +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)];
  return plate;
}

function generateVIN(): string {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let vin = '';
  for (let i = 0; i < 17; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)];
  }
  return vin;
}

function generateSpecificVehicle(make: string) {
  const models = carModels[make];
  const model = models[Math.floor(Math.random() * models.length)];
  const currentYear = new Date().getFullYear();
  const year = currentYear - Math.floor(Math.random() * 15);

  return {
    make,
    model,
    year,
    license_plate: generateLicensePlate(),
    vin: generateVIN()
  };
}

function generateSpecificService(vehicleId: string, serviceType: string, serviceDate?: Date) {
  const quantity = Math.floor(Math.random() * 2) + 1;
  const unitPrice = (Math.random() * 200 + 30).toFixed(2);

  const services = [{
    description: serviceType,
    quantity,
    unit_price: parseFloat(unitPrice)
  }];

  const subtotal = services.reduce((sum, s) => sum + (s.quantity * s.unit_price), 0);
  const vat = subtotal * 0.24;
  const total = subtotal + vat;

  const date = serviceDate || new Date(
    2023 + Math.floor(Math.random() * 2),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  );

  const mileage = Math.floor(Math.random() * 150000) + 10000;
  const notes = [
    "Customer reported strange noise",
    "Routine maintenance",
    "Follow-up from previous service",
    "Customer noticed warning light",
    "Scheduled maintenance per manufacturer",
    "Customer requested full check-up",
    "Preventive maintenance"
  ][Math.floor(Math.random() * 7)];

  return {
    vehicle_id: vehicleId,
    date: date.toISOString().split('T')[0],
    description: serviceType,
    mileage,
    notes,
    services,
    subtotal,
    vat,
    total
  };
}

export async function seedDatabase() {
  console.log('Starting comprehensive database seeding...');
  console.log(`Target: All ${carMakes.length} car makes and all ${serviceDescriptions.length} service types`);

  try {
    const customers = generateMockCustomers(100);
    let successCount = 0;
    let skipCount = 0;
    let vehicleCount = 0;
    let serviceRecordCount = 0;

    const usedServiceTypes = new Set<string>();
    const usedCarMakes = new Set<string>();

    let carMakeIndex = 0;
    let serviceTypeIndex = 0;

    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      console.log(`Processing customer ${i + 1}/${customers.length}: ${customer.name}`);

      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customer.email)
        .maybeSingle();

      if (existingCustomer) {
        console.log(`  Customer with email ${customer.email} already exists, skipping...`);
        skipCount++;
        continue;
      }

      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

      if (customerError) {
        console.error(`Error inserting customer ${customer.name}:`, customerError);
        continue;
      }

      successCount++;

      const numVehicles = i < carMakes.length ? 1 : (Math.random() < 0.3 ? 1 : Math.random() < 0.7 ? 2 : 3);
      console.log(`  Creating ${numVehicles} vehicle(s) for ${customer.name}`);

      for (let v = 0; v < numVehicles; v++) {
        let vehicle;

        if (carMakeIndex < carMakes.length && v === 0) {
          vehicle = generateSpecificVehicle(carMakes[carMakeIndex]);
          usedCarMakes.add(carMakes[carMakeIndex]);
          console.log(`    Ensuring coverage: ${carMakes[carMakeIndex]}`);
          carMakeIndex++;
        } else {
          vehicle = generateVehicle();
          usedCarMakes.add(vehicle.make);
        }

        let attempts = 0;
        let isDuplicate = true;

        while (isDuplicate && attempts < 10) {
          const { data: existingVehicle } = await supabase
            .from('vehicles')
            .select('id')
            .or(`license_plate.eq.${vehicle.license_plate},vin.eq.${vehicle.vin}`)
            .maybeSingle();

          if (!existingVehicle) {
            isDuplicate = false;
          } else {
            console.log(`    Vehicle with plate ${vehicle.license_plate} or VIN exists, regenerating...`);
            if (carMakeIndex <= carMakes.length && v === 0) {
              vehicle = generateSpecificVehicle(vehicle.make);
            } else {
              vehicle = generateVehicle();
            }
            attempts++;
          }
        }

        if (isDuplicate) {
          console.log(`    Could not generate unique vehicle after ${attempts} attempts, skipping...`);
          continue;
        }

        const vehicleData = {
          ...vehicle,
          customer_id: customerData.id
        };

        const { data: insertedVehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .insert([vehicleData])
          .select()
          .single();

        if (vehicleError) {
          console.error(`  Error inserting vehicle:`, vehicleError);
          continue;
        }

        vehicleCount++;

        const numServices = serviceTypeIndex < serviceDescriptions.length ?
          Math.max(2, Math.floor(Math.random() * 4) + 1) :
          Math.floor(Math.random() * 5) + 1;

        console.log(`    Creating ${numServices} service(s) for ${vehicle.make} ${vehicle.model}`);

        const services = [];
        const startDate = new Date(2023, 0, 1);
        const endDate = new Date();
        const timeSpan = endDate.getTime() - startDate.getTime();

        for (let s = 0; s < numServices; s++) {
          const serviceDate = new Date(startDate.getTime() + (timeSpan / numServices) * s + Math.random() * (timeSpan / numServices));

          let service;
          if (serviceTypeIndex < serviceDescriptions.length && s === 0) {
            service = generateSpecificService(insertedVehicle.id, serviceDescriptions[serviceTypeIndex], serviceDate);
            usedServiceTypes.add(serviceDescriptions[serviceTypeIndex]);
            console.log(`      Ensuring coverage: ${serviceDescriptions[serviceTypeIndex]}`);
            serviceTypeIndex++;
          } else {
            service = generateService(insertedVehicle.id, serviceDate);
            if (service.description) {
              service.description.split(' | ').forEach(desc => usedServiceTypes.add(desc));
            }
          }

          services.push(service);
        }

        services.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        for (const service of services) {
          const { error: serviceError } = await supabase
            .from('service_records')
            .insert([service]);

          if (serviceError) {
            console.error(`    Error inserting service:`, serviceError);
          } else {
            serviceRecordCount++;
          }
        }
      }

      if (usedCarMakes.size === carMakes.length && usedServiceTypes.size === serviceDescriptions.length) {
        console.log('\n✓ Full coverage achieved! All car makes and service types represented.');
      }
    }

    console.log('\n=== Database Seeding Completed ===');
    console.log(`Customers added: ${successCount}`);
    console.log(`Customers skipped (duplicates): ${skipCount}`);
    console.log(`Vehicles created: ${vehicleCount}`);
    console.log(`Service records created: ${serviceRecordCount}`);
    console.log(`\nCoverage Report:`);
    console.log(`  Car makes covered: ${usedCarMakes.size}/${carMakes.length} (${Math.round(usedCarMakes.size/carMakes.length*100)}%)`);
    console.log(`  Service types covered: ${usedServiceTypes.size}/${serviceDescriptions.length} (${Math.round(usedServiceTypes.size/serviceDescriptions.length*100)}%)`);

    if (usedCarMakes.size < carMakes.length) {
      const missing = carMakes.filter(m => !usedCarMakes.has(m));
      console.log(`  Missing car makes: ${missing.join(', ')}`);
    }

    if (usedServiceTypes.size < serviceDescriptions.length) {
      const missing = serviceDescriptions.filter(s => !usedServiceTypes.has(s));
      console.log(`  Missing service types: ${missing.join(', ')}`);
    }

    return {
      success: true,
      message: `Database seeded successfully! Added ${successCount} customers, ${vehicleCount} vehicles, and ${serviceRecordCount} service records. Coverage: ${usedCarMakes.size}/${carMakes.length} car makes, ${usedServiceTypes.size}/${serviceDescriptions.length} service types. ${skipCount > 0 ? `Skipped ${skipCount} duplicates.` : ''}`
    };
  } catch (error) {
    console.error('Error during seeding:', error);
    return { success: false, error };
  }
}

export async function clearDatabase() {
  console.log('Clearing database...');

  try {
    await supabase.from('service_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Deleted all service records');

    await supabase.from('vehicles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Deleted all vehicles');

    await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Deleted all customers');

    console.log('Database cleared successfully!');
    return { success: true, message: 'Database cleared successfully' };
  } catch (error) {
    console.error('Error clearing database:', error);
    return { success: false, error };
  }
}
