<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('oldsn')->nullable();
            $table->string('newsn');
            $table->string('name');
            $table->string('brand');
            $table->string('model');
            $table->string('modelsn');
            $table->integer('yearsl');
            $table->string('dateexp');
            $table->float('price');
            $table->string('organization');
            $table->string('location');
            $table->text('detail')->nullable();
            $table->text('description')->nullable();
            $table->string('status');
            $table->text('image');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
